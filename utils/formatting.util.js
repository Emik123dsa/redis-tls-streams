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

const { EventType, CommandType } = require('../shared/stream.constants');
const { capitalize } = require('./capitalizing.util');

function createCommandBinding(name, binding) {
  return [name, CommandType, binding].join('.');
}

function createEventBinding(name, binding) {
  return [name, EventType, binding].join('.');
}

function createEventSchema(name) {
  return [name, capitalize(EventType)].join('');
}

function createCommandSchema(name) {
  return [name, capitalize(CommandType)].join('');
}

function formatStreamBinding(name, binding, postfix = 'stream') {
  return [name, binding, postfix].join(':').toLowerCase();
}

function formatConsumerName(consumerName, binding) {
  const streamType = binding.includes(EventType) ? EventType : CommandType;

  if (consumerName.includes('%s')) {
    consumerName = consumerName.replace('%s', streamType);
  }

  return {
    streamType,
    consumerName,
  };
}

module.exports = {
  createEventSchema,
  createCommandSchema,
  createCommandBinding,
  createEventBinding,
  formatStreamBinding,
  formatConsumerName,
};
