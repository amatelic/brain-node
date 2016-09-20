var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let Message =  Schema({
  title : String,
  message : String,
  _userId: { type: Schema.Types.ObjectId, ref: 'User' },
  image: String,
  status : String,
});

mongoose.model("Message", Message);
