/**
 * Copyright 2022 (C) Emil Shari <emil.shari87@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { logger } = require('./logger');
const { redisClient } = require('./in-memory-storage');

const {
  environment: {
    redis: { streams },
  },
} = require('../shared');

const { ErrorReply, commandOptions } = require('redis');
const { broadcast } = require('./broadcast');
const { EventBindings, eventHandlers } = require('./handlers/event.handler');
const { buildConsumerGroups } = require('../utils');

const {
  createConsumerGroup,
  closeConnection,
  handleClientEvents,
  createConnection,
  createConsumer,
} = require('./storage-adapter');

const { unique } = require('../utils/shared.util');
const { buildConsumers, unwrapStream } = require('../utils/streaming.util');

const { EventType, CommandType } = require('../shared/stream.constants');

async function createConsumerGroups() {
  try {
    const consumerGroups = buildConsumerGroups(
      streams,
      (stream, consumerGroup) => createConsumerGroup(stream, consumerGroup),
    );

    await Promise.all(consumerGroups);
  } catch (error) {
    const errorMessage = error.message;
    const groupAlreadyExistsCode = new RegExp('^BUSYGROUP', 'gim');

    if (
      error instanceof ErrorReply &&
      groupAlreadyExistsCode.test(errorMessage)
    ) {
      logger.debug(errorMessage);
    } else {
      logger.warn(errorMessage);
      await closeConnection();
    }
  }
}

async function createConsumers() {
  const consumeHandlers = [];
  try {
    const consumers = buildConsumers(
      streams,
      (stream, streamType, consumerGroup, consumerName) => {
        try {
          return createConsumer(stream, consumerGroup, consumerName);
        } finally {
          consumeHandlers.push({
            stream,
            streamType,
            consumerGroup,
            consumerName,
          });
        }
      },
    );

    await Promise.all(consumers);
  } catch (error) {
    const errorMessage = error.message;
    logger.error(errorMessage);
    await closeConnection();
  } finally {
    return consumeHandlers;
  }
}

async function handleClientStreaming(consumerStreams) {
  const clientStreams = consumerStreams.map(({ stream }) => ({
    key: stream,
    id: '>',
  }));

  const consumerHandlings = new Map();

  streams.forEach((stream) =>
    stream.consumer.handlings.forEach((event, stream) => {
      if (consumerHandlings.has(stream)) return;
      return consumerHandlings.set(stream, event);
    }),
  );

  const [consumerGroup] = unique(
    consumerStreams.flatMap(({ consumerGroup }) => consumerGroup),
  );

  const [consumer] = unique(
    consumerStreams.flatMap(({ consumerName }) => consumerName),
  );

  while (true) {
    try {
      const records = await redisClient.xReadGroup(
        commandOptions({
          isolated: true,
          returnBuffers: true,
          asap: true,
          ignorePubSubMode: true,
        }),
        consumerGroup,
        consumer,
        clientStreams,
        { COUNT: 1, BLOCK: 5000, NOACK: true },
      );

      if (records) {
        const [{ messages, name }] = records;
        const [{ id: messageId, message }] = messages;

        const stream = name.toString();
        const eventType = consumerHandlings.get(stream);

        if (!eventHandlers.has(eventType)) throw new RangeError(eventType);

        const processEvent = eventHandlers.get(eventType);
        await processEvent(messageId, message);
      }
    } catch (error) {
      logger.error(error.message);
      await closeConnection();
    }
  }
}

async function initClient() {
  await createConnection();

  await createConsumerGroups();

  const consumers = await createConsumers();
  const consumerTypes = [EventType, CommandType];

  for (const consumerType of consumerTypes) {
    const consumerStreams =
      consumers.filter(({ streamType }) => consumerType.includes(streamType)) ??
      [];

    if (consumerStreams.length) handleClientStreaming(consumerStreams);
  }

  return handleClientEvents(EventType, (error) => logger.error(error));
}

module.exports = { initClient };
