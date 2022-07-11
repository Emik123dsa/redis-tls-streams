const {
  messagingStreamsKey,
  messagingStreams,
} = require('./streams/message.streams');

module.exports = {
  production: process.env.NODE_ENV === 'production',

  server: {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
  },

  websocket: {
    url: `ws://localhost:${process.env.SERVER_PORT}`,
  },

  client: {
    url: null,
  },

  redis: {
    url: process.env.REDIS_URI,

    password: process.env.REDIS_PASSWORD,

    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_TLS_PORT,
      tls: Boolean(process.env.REDIS_TLS_ENABLED === 'true'),
    },

    ssl: {
      cert: process.env.REDIS_TLS_CERT_FILE,
      key: process.env.REDIS_TLS_KEY_FILE,
      caCert: process.env.REDIS_TLS_CA_CERT_FILE,
      dhparam: process.env.REDIS_TLS_DH_PARAMS_FILE,
    },

    streams: new Map([[messagingStreamsKey, messagingStreams]]),
  },

  tokens: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      privateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      privateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    },
  },
};
