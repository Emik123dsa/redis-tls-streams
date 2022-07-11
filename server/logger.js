const winston = require('winston');

const { environment } = require('../shared');

const logLevel = process.env.LOG_LEVEL || 'debug';

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple(),
);

const logger = new winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: {},
  transports: environment.production
    ? [
        new winston.transports.File({
          filename: '../logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: '../logs/combined.log' }),
      ]
    : new winston.transports.Console({
        format: logFormat,
      }),
});

module.exports = { logger };
