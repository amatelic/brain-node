var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let Users = Schema({
  username: String,
  name:   String,
  email:  String,
  created: { type: Date, default: Date.now },
  plan: { type: String, default: 'basic' },
  data: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  //{type: mongoose.Schema.ObjectId, default: mongoose.Types.ObjectId },
});

mongoose.model("Users", Users);
