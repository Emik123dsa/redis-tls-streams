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

const { messageBindings } = require('../constants/message.bindings');

const { buildStreamBindings, buildConsumerHandlings } = require('../../utils');

const messagingSteamsKey = process.env.REDIS_STREAMS_MESSAGING_KEY;

const messagingStreams = {
  consumer: {
    id: process.env.REDIS_STREAMS_MESSAGING_CONSUMER_ID,
    groupId: process.env.REDIS_STREAMS_MESSAGING_CONSUMER_GROUP_ID,
    handlings: buildConsumerHandlings(messagingSteamsKey, messageBindings),
  },
  producer: {
    // TODO: override producer context.
    // bindings: buildProducerBindings(messagingSteamsKey, messageBindings),
  },
  bindings: buildStreamBindings(messagingSteamsKey, messageBindings),
};

module.exports = {
  messagingStreams,
  messagingStreamsKey: Symbol.for(messagingSteamsKey),
};
