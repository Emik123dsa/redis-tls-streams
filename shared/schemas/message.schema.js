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

const { CommandType } = require('./command.schema');
const { EventType } = require('./event.schema');

const messageFields = [
  {
    name: 'user_id',
    type: 'string',
    default: 'anonymous',
  },
  {
    name: 'client_id',
    type: 'string',
  },
  {
    name: 'content',
    type: 'string',
  },
  {
    name: 'created_at',
    type: {
      type: 'long',
      logicalType: 'timestamp-millis',
      default: Date.now(),
    },
  },
];

const messageCommand = {
  name: 'Message',
  fields: messageFields,
};

const messageEvent = {
  name: 'Message',
  fields: [
    {
      name: 'id',
      type: 'string',
    },
    ...messageFields,
    {
      name: 'updated_at',
      type: { type: 'long', logicalType: 'timestamp-millis' },
    },
  ],
};

const MessageEventType = EventType(messageEvent);

const MessageCommandType = CommandType(messageCommand);

module.exports = { MessageCommandType, MessageEventType };
