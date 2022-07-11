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

const { redisClient } = require('./in-memory-storage');
const retry = require('async-retry');

function createConsumerGroup(key, groupName) {
  return redisClient.xGroupCreate(key, groupName, '$', {
    MKSTREAM: true,
  });
}

function createConsumer(key, groupName, consumerName) {
  return redisClient.xGroupCreateConsumer(key, groupName, consumerName);
}

function handleClientEvents(event, callback) {
  return redisClient.on(event, callback);
}

async function sendBinaryMessage(
  key,
  value,
  options = {
    TRIM: {
      strategy: 'MAXLEN',
      strategyModifier: '~',
      threshold: 1000,
    },
    NOMKSTREAM: true,
  },
) {
  return await redisClient.xAdd(key, '*', { binary: value }, options);
}

async function createConnection() {
  const connection = await retry((bail) => {
    return redisClient.connect();
  }, {});

  return connection;
}

async function closeConnection() {
  return await redisClient.quit();
}

module.exports = {
  createConsumerGroup,
  createConnection,
  closeConnection,
  handleClientEvents,
  createConsumer,
  sendBinaryMessage,
};
