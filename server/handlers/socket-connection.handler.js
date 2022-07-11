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
  environment: {
    redis: { stream },
  },
} = require('../../shared');

const { logger } = require('../logger');
const { commandDispatchers } = require('../actors');

const { closeConnection } = require('../storage-adapter');
const { GenericCommandType } = require('../../shared/schemas/command.schema');

async function handleSocketMessage(message, clientId) {
  try {
    const command = GenericCommandType.fromBuffer(message);
    const commandType = command.type;

    if (!commandDispatchers.has(commandType)) {
      throw new RangeError(commandType);
    }

    const dispatchCommand = commandDispatchers.get(commandType);

    await dispatchCommand(command, clientId);
  } catch (error) {
    logger.error(error);
    await closeConnection();
  }
}

function handleSocketConnection(socket, request, clientId) {
  socket.on('error', (error) => logger.error(error));
  socket.on('message', (message) => handleSocketMessage(message, clientId));
}

module.exports = { handleSocketConnection };
