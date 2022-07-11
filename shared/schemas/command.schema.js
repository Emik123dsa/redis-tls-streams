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

const { randomUUID, capitalize } = require('../../utils');

const { AvroTimestampMillis } = require('@ovotech/avro-timestamp-millis');
const { createCommandSchema } = require('../../utils/formatting.util');

const commandNamespace = 'com.schema.cmd.avro';

const commandMetaDataType = {
  type: 'map',
  name: 'metadata',
  values: ['string', 'float'],
  default: {},
};

const commandFields = [
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
    name: 'creation_timestamp',
    type: {
      type: 'long',
      logicalType: 'timestamp-millis',
    },
    default: Date.now(),
  },
];

const genericCommandSchema = {
  name: 'GenericCommand',
  type: 'record',
  namespace: commandNamespace,

  fields: [
    ...commandFields,
    {
      name: 'metadata',
      type: commandMetaDataType,
    },
  ],
};

const GenericCommandType = Type.forSchema(genericCommandSchema, {
  logicalTypes: { 'timestamp-millis': AvroTimestampMillis },
});

const commandSchema = ({ name, fields = [] } = {}) => ({
  name: createCommandSchema(name),
  type: 'record',
  namespace: commandNamespace,
  fields: [
    ...commandFields,
    {
      name: 'metadata',
      type: { type: 'record', fields },
    },
  ],
});

const CommandType = (schema) => {
  const typeSchema = commandSchema(schema);

  return Type.forSchema(typeSchema, {
    omitRecordMethods: true,
    assertLogicalTypes: false,
    wrapUnions: false,
    logicalTypes: { 'timestamp-millis': AvroTimestampMillis },
  });
};

module.exports = { CommandType, GenericCommandType };
