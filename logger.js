const moment = require('moment');
const util = require('util');
const pino = require('pino')
const logger = pino({
  destination:{
    sync: true
  },
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    }
  }
})


logger.customError = (error, details = '', LogLevel = 'error') => {
  // We can manage universal data using globals
  const req = global.reqInfo;
  // The error is parsed in a new Error(error: the error passed to this function)
  const e = new Error(error);
  // The error frame from origin error's stack
  const frame = e.stack.split('\n')[2];
  // console.log(frame);
  // the function where the error occured
  const functionName = frame.split(' ')[5];
  // The exact line number
  const lineNumber = frame.split(':').reverse()[1];
  // The final object to be logged in the console
  const errorInfo = {
    // If we have a request object then parse it otherwise it is null
    reqInfo: req
      ? {
          req: {
            req: req.method,
            path: req.path,
            body: req.body,
            query: req.query,
          },
          // If a req has a property with key user then extract relevant information otherwise return null
          user: req.user
            ? {
                id: req.user.id,
                name: req.user.name,
              }
            : null,
          // The server information at the moment of error handling
          server: {
            ip: req.ip,
            servertime: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
        }
      : null,
    functionName,
    lineNumber,
    // Assuming that error is occured in application layer and not the database end.
    errorType: 'application error',
    stack: error.stack || e.stack,
    message: error.message || e.message,
    env: process.env.NODE_ENV,
    // defaults read from environment variable
    logLevel: LogLevel,
    process: details,
  };
  // Print appropriate level of log from [info, debug, warn, error]
  switch (LogLevel) {
    case 'info':
      logger.info(errorInfo);
      break;
    case 'debug':
      logger.debug(errorInfo);
      break;
    case 'warn':
      logger.warn(errorInfo);
      break;
    case 'error':
      logger.error(errorInfo);
      break;
    default:
      logger.error(errorInfo);
  }
};

module.exports = logger

