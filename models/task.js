var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let Task =  Schema({
  year: Number,
  month: Number,
  _userId: { type: Schema.Types.ObjectId, ref: 'User' },
  days: []
});

mongoose.model("Task", Task);
