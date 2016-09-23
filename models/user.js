var mongoose = require('mongoose');
const moment = require('moment');
var Schema = mongoose.Schema;
let Task = mongoose.model("Task");

let Users = Schema({
  username: String,
  name:   String,
  email:  String,
  created: { type: Date, default: Date.now },
  plan: { type: String, default: 'basic' },
  data: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  //{type: mongoose.Schema.ObjectId, default: mongoose.Types.ObjectId },
});

Users.statics.random = function(id) {
  return Task.find({id, year, month})
}


mongoose.model("Users", Users);
