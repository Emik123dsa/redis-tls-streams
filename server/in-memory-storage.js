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

const redis = require('redis');
const fs = require('fs');
const {
  redis: { socket, ssl, password },
} = require('../shared/environment');

const redisClient = redis.createClient({
  password,
  socket: {
    host: socket.host,
    port: socket.port,
    tls: socket.tls,
    maxVersion: 'TLSv1.3',
    minVersion: 'TLSv1.3',
    dhparam: fs.readFileSync(ssl.dhparam, { encoding: 'ascii' }),
    ca: [fs.readFileSync(ssl.caCert, { encoding: 'ascii' })],
    key: fs.readFileSync(ssl.key, { encoding: 'ascii' }),
    cert: fs.readFileSync(ssl.cert, { encoding: 'ascii' }),
  },
});

module.exports = { redisClient };
