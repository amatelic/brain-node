var mongoose = require('mongoose');
const moment = require('moment');
var Schema = mongoose.Schema;

let Task =  Schema({
  year: { type: Number, default: moment().year() },
  month: { type: Number, default: moment().month() },
  _userId: { type: Schema.Types.ObjectId, ref: 'User' },
  days: []
});

mongoose.model("Task", Task);
