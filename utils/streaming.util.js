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

const {
  CommandBinding,
  EventBinding,
  EventType,
} = require('../shared/stream.constants');

const {
  formatStreamBinding,
  createCommandBinding,
  createEventBinding,
  formatConsumerName,
} = require('./formatting.util');
const { isFunction } = require('./shared.util');

function unwrapStream(stream, separator = ':') {
  const [key] = stream.split(separator);
  const streamsKey = Symbol.for(key);

  return streamsKey;
}

function buildConsumerHandlings(streamsKey, bindings) {
  const handlings = new Map();

  const events = bindings.get(EventBinding);
  const commands = bindings.get(CommandBinding);

  return commands.reduce((accumulator, command, index) => {
    const stream = formatStreamBinding(streamsKey, command);
    const event = createEventBinding(streamsKey, events[index]);

    accumulator.set(stream, event);
    return accumulator;
  }, handlings);
}

function buildConsumerGroups(streams, callback) {
  const consumerGroups = [];

  for (const [
    ,
    {
      consumer: { groupId },
      bindings,
    },
  ] of streams) {
    for (const [, stream] of bindings) {
      if (!isFunction(callback)) continue;

      const consumerGroup = callback(stream, groupId);
      consumerGroups.push(consumerGroup);
    }
  }

  return consumerGroups;
}

function buildConsumers(streams, callback) {
  const consumers = [];

  for (const [
    ,
    {
      consumer: { id, groupId: consumerGroup },
      bindings,
    },
  ] of streams) {
    for (const [binding, stream] of bindings) {
      const { streamType, consumerName } = formatConsumerName(id, binding);

      if (!isFunction(callback)) continue;

      const consumer = callback(
        stream,
        streamType,
        consumerGroup,
        consumerName,
      );

      consumers.push(consumer);
    }
  }

  return consumers;
}

function buildStreamBindings(bindingKey, bindingsOperations) {
  const bindings = new Map();

  bindingsOperations.forEach((operations, key) =>
    operations.forEach((operation) => {
      const bindingOperation = EventBinding.includes(key)
        ? createEventBinding(bindingKey, operation)
        : createCommandBinding(bindingKey, operation);

      bindings.set(
        bindingOperation,
        formatStreamBinding(bindingKey, operation),
      );
    }),
  );

  return bindings;
}

module.exports = {
  buildStreamBindings,
  buildConsumerGroups,
  buildConsumers,
  unwrapStream,
  buildConsumerHandlings,
};
