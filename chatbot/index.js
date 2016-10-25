const http = require('http');
const socket = require('socket.io');
const {User} = require('../db/db');
const Chatbot = require('./chatbot/chatbot');
const response = require('./chatbot/responses/user');
const Intents = require('./chatbot/intents/intent');
const PORT = 7000;

module.exports = function(app) {
  let chatbot = new Chatbot(Intents);
  let taskBot = new Chatbot(new Intents('./userFile.json'), response);

  const server = http.Server(app);
  const io = socket(server);
  io.on('connection', function (socket) {

    /**
     * On client response
     */

    socket.on('id', helloUser);
    socket.on('message', obj => {
      let text = obj.message;
      taskBot.say(text)
            .then(d => {
              sendMessage('message', {message: response[d.intent](d.entitie)})
            }).catch(err => console.log(err))
    });

    /**
     * On client response
     */

    socket.emit('message', { hello: 'world' });
    socket.emit('close', { hello: 'world' });

    function sendMessage(evt, obj) {
      socket.emit(evt, obj);
    }

    function helloUser(id) {
      User.findById(id).then(user => {
        sendMessage('hello', {message: `Hello ${user.name}. How are you?`});
      }).catch(err => console.log(err))
    }
  });

  server.listen(PORT, () => console.log(`Socket listenint on ${PORT}`));
}
