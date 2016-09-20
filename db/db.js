const mongoose = require('mongoose');
const UserScheme = require('../models/user');
const TaskScheme = require('../models/task');
const MessageScheme = require('../models/message');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/api');

let User = mongoose.model("Users");
let Task = mongoose.model("Task");
let Message = mongoose.model("Message");

module.exports =  {
  User,
  Task,
  Message
};
