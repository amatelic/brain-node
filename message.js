const cron = require('node-cron');
const {Message} = require('./db/db');
const {messages} = require('./app/config/logger');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(500);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
// let task = cron.schedule('40 51 2 * * Monday', function(){
//   console.log('running a task every 10 seconds');
// });
// task.start();


function send() {
  Message.find({title: 'Come on dude!'}).then(d => {
    console.log(d);
  })
}

function create(user, message) {
  let id = user || '57d8054a2813b26d3a2e5189';
  let userMessage = {
    title: 'Come on dude!',
    message: 'Without any practice you will not succede.',
    status: true,
    image: 'bad.jpg'
    created: '',
    author: ''
  };
  let data = Object.assign({userId: id}, userMessage);
  let created = new Message(data);
  created.save((err, message) => {
    if (err) {
      messages.log('error', err.toString());
      return console.error(err);
    }
    messages.log('info', `Created message for id ${id} -> title: ${userMessage.title}`);
  });

}
// send();
// create();
module.exports  = {
  send,
  create,
};
