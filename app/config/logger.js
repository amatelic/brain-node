const winston = require('winston');

//app logs
var appLog = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: './app/logs/app-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: './app/logs/app-error.log',
      level: 'error'
    }),
    new (winston.transports.File)({
      name: 'messages',
      filename: './app/logs/messages.log',
      level: 'info'
    })
  ]
});

//messages logs
var messages = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: './app/logs/message-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: './app/logs/message-error.log',
      level: 'error'
    })
  ]
})

module.exports = {
  appLog,
  messages
};
