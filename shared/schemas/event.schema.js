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

const { Type } = require('avsc');
const { AvroTimestampMillis } = require('@ovotech/avro-timestamp-millis');
const { randomUUID, capitalize } = require('../../utils');
const { createEventSchema } = require('../../utils/formatting.util');

const eventNamespace = 'com.schema.event.avro';

const eventDataType = {
  type: 'map',
  values: 'string',
  default: {},
};

const eventFields = [
  {
    name: 'id',
    type: {
      type: 'fixed',
      size: 36,
      name: 'uuid',
    },
    default: randomUUID(),
  },
  {
    name: 'type',
    type: 'string',
  },
  {
    name: 'timestamp',
    type: {
      type: 'long',
      logicalType: 'timestamp-millis',
    },
    default: Date.now(),
  },
];

const genericEventSchema = {
  name: 'Event',
  type: 'record',
  namespace: eventNamespace,
  fields: [
    ...eventFields,
    {
      name: 'data',
      type: eventDataType,
    },
  ],
};

const GenericEventType = Type.forSchema(genericEventSchema, {
  logicalTypes: { 'timestamp-millis': AvroTimestampMillis },
});

const eventSchema = ({ name, fields = [] } = {}) => ({
  name: createEventSchema(name),
  type: 'record',
  namespace: eventNamespace,
  fields: [
    ...eventFields,
    {
      name: 'data',
      type: { type: 'record', fields },
    },
  ],
});

const EventType = (schema) => {
  const typeSchema = eventSchema(schema);

  return Type.forSchema(typeSchema, {
    logicalTypes: { 'timestamp-millis': AvroTimestampMillis },
  });
};

module.exports = { EventType, GenericEventType };
