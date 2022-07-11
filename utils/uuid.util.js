const crypto = require('crypto');

function randomUUID() {
  const isServer = typeof window === 'undefined';
  return isServer ? crypto.randomUUID() : window.crypto.randomUUID();
}

module.exports = { randomUUID };
