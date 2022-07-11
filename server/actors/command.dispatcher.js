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

const humps = require('humps');
const sanitizeHtml = require('sanitize-html');
const { logger } = require('../logger');

const messageCommands = require('../../shared/commands/message.commands');

const { MessageCommandType } = require('../../shared/schemas/message.schema');
const { sendBinaryMessage } = require('../storage-adapter');

const { messagingStreams } = require('../../shared/streams/message.streams');

const commandDispatchers = new Map([
  [
    messageCommands.createOut,
    async (command, clientId) => {
      try {
        const content = sanitizeHtml(command.metadata.content);

        if (!content) throw 'Content of the message can not be null/blank';

        const createCommand = {
          ...command,
          metadata: humps.decamelizeKeys({
            clientId,
            content,
            createdAt: Date.now(),
          }),
        };

        if (!MessageCommandType.isValid(createCommand)) {
          throw new ReferenceError(createCommand);
        }

        const createMessageCommand = MessageCommandType.toBuffer(createCommand);

        const createMessageStream = messagingStreams.bindings.get(
          createCommand.type,
        );

        await sendBinaryMessage(createMessageStream, createMessageCommand);
      } catch (error) {
        logger.warn(error.message);
      }
    },
  ],
  [messageCommands.updateOut, async () => {}],
  [messageCommands.deleteOut, async () => {}],
]);

module.exports = { commandDispatchers };
