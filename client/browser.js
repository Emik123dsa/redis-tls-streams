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

const avro = require('avsc');

const {
  environment: {
    websocket: { url },
    redis: { streams },
  },
} = require('../shared');

const messageCommands = require('../shared/commands/message.commands');
const { GenericCommandType } = require('../shared/schemas/command.schema');

const webSocket = new window.WebSocket(url, ['ws']);

const messagingForm = document.getElementById('messagingForm');

function createMessageCommand(content, callback) {
  const messageCommand = {
    type: messageCommands.createOut,
    metadata: { content },
  };

  if (GenericCommandType.isValid(messageCommand)) {
    const messageCommandBuffer = GenericCommandType.toBuffer(messageCommand);
    return callback(messageCommandBuffer);
  }
}

function handleSubmitForm(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  const messagingData = new FormData(messagingForm).values();
  const [message] = Array.from(messagingData);

  if (message) {
    createMessageCommand(message, (buffer) => webSocket.send(buffer));
  }

  return messagingForm.reset();
}

webSocket.addEventListener(
  'open',
  () => messagingForm.addEventListener('submit', handleSubmitForm),
  { once: true },
);

webSocket.addEventListener('message', (event) => {});
webSocket.addEventListener('error', (event) => {});

document.addEventListener('DOMContentLoaded', () => {
  const messagingElementRef = document.getElementById('messaging');
  return messagingElementRef.focus();
});
