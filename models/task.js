var mongoose = require('mongoose');
const moment = require('moment');
const Stages = require('../machineLearning/stages');

var Schema = mongoose.Schema;

let Task =  Schema({
  year: { type: Number, default: moment().year() },
  month: { type: Number, default: moment().month() },
  _userId: { type: Schema.Types.ObjectId, ref: 'User' },
  days: []
});

Task.statics.new = function (data, req) {
  let id = req.get('api-key');
  let query = { _userId: id, year: data.year, month: data.month };
  Promise.all([
    this.findOne(query),
    Stages.stageClassifier([data.name]),
    data
  ])
  .then(formatData)
  .then((task) => this.update(query, { $push: { days: task }}))
  .catch(err => console.log(err));
}

function formatData(all) {
  let [task, stage, data] = all;
  data.month = parseInt(data.month);
  data.year = parseInt(data.year);
  data.name = data.name.replace(' ', '_');
  data.type = Stages.bayesHabit(stage).name;
  data.id = task.days.length + 1;
  return data
}

Task.statics.updateRecord = function (data, req) {
  let {year, month, id} = req;
  let name = data.name.replace(' ', '_');
  var $set = { $set: {} };
  $set.$set['days.' + (parseInt(data.id) - 1) +'.days'] = data.days;
  return this.update({_userId: id, month, year, days: {$elemMatch: {name}}}, $set)
  .catch(err => console.log(err));
}

mongoose.model("Task", Task);
