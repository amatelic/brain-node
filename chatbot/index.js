const http = require('http');
const socket = require('socket.io');
const {User} = require('../db/db');

const PORT = 7000;

module.exports = function(app) {
  const server = http.Server(app);
  const io = socket(server);
  io.on('connection', function (socket) {

    /**
     * On client response
     */

    socket.on('id', helloUser);
    socket.on('message', obj => {
      sendMessage('message', {message: 11})
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
