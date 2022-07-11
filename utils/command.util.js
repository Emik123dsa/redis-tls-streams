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

const { CommandBinding } = require('../shared/stream.constants');
const { capitalize } = require('./capitalizing.util');
const { createCommandBinding } = require('./formatting.util');

function createCommands(bindings, streamsKey) {
  const commandsKey = (streamsKey =
    typeof streamsKey === 'symbol' ? Symbol.keyFor(streamsKey) : streamsKey);

  const commands = {};

  bindings.get(CommandBinding).forEach((binding) =>
    Object.assign(commands, {
      [binding + capitalize(CommandBinding)]: createCommandBinding(
        commandsKey,
        binding,
      ),
    }),
  );

  return commands;
}

module.exports = { createCommands };
