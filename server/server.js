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

const crypto = require('crypto');

const {
  server: { host, port },
} = require('../shared/environment');

const { createServer } = require('http');
const { WebSocketServer } = require('ws');

const {
  handleSocketConnection,
} = require('./handlers/socket-connection.handler');

const { HttpStatusCode } = require('./constants/http-status.codes');

const { HttpError, HttpForbiddenError } = require('./errors/http.errors');

const { JsonWebTokenError } = require('jsonwebtoken');
const { randomUUID } = require('../utils');

const server = createServer((req, res) => res.end());
const webSocketServer = new WebSocketServer({ noServer: true });

async function initServer() {
  const protocols = ['websocket'];

  server.on('upgrade', async (request, socket, head) => {
    try {
      const protocol = request.headers.upgrade;

      if (protocols.indexOf(protocol) === -1) {
        throw new HttpForbiddenError(request.headers.upgrade);
      }

      webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
        const clientId = randomUUID();

        webSocketServer.emit('connection', webSocket, request, clientId);
      });
    } catch (error) {
      if (error instanceof HttpError) {
        const errorCode = error.getCode();
        socket.write(errorCode);
      }

      if (error instanceof JsonWebTokenError) {
        socket.write(HttpStatusCode.UNAUTHORIZED);
      }

      return socket.destroy(error);
    }
  });

  webSocketServer.on('connection', handleSocketConnection);
  server.listen(port, host);
}

module.exports = { server, webSocketServer, initServer };
