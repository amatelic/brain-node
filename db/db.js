const mongoose = require('mongoose');
const UserScheme = require('../models/user');
const TaskScheme = require('../models/task');
const MessageScheme = require('../models/message');
const QuoteScheme = require('../models/quote');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/api');

let Task = mongoose.model("Task");
let User = mongoose.model("Users");
let Message = mongoose.model("Message");
let Quote = mongoose.model("Quote");

module.exports =  {
  User,
  Task,
  Message,
  Quote
};
