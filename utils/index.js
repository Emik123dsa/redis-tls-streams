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
const { capitalize } = require('./capitalizing.util');

const {
  createCommandBinding,
  createEventBinding,
  formatStreamBinding,
} = require('./formatting.util');

const {
  buildStreamBindings,
  buildConsumerGroups,
  buildConsumerHandlings,
} = require('./streaming.util');

const { createEvents } = require('./event.util');
const { createCommands } = require('./command.util');
const { randomUUID } = require('./uuid.util');

module.exports = {
  randomUUID,
  capitalize,
  createEvents,
  createCommands,
  buildConsumerHandlings,
  formatStreamBinding,
  createCommandBinding,
  createEventBinding,
  buildStreamBindings,
  buildConsumerGroups,
};
