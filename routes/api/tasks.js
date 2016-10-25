const _ = require('lodash');
const express = require('express');
const moment = require('moment');
const Error = require('../../app/config/errors');
const Stages = require('../../machineLearning/stages');
const urlEncoder = require('body-parser').urlencoded({ extended: false });
const {addMeta, ErrorMessage} = require('../../helpers/helpers');
const {User, Task, Message, Quote} = require('../../db/db');
const {setUrl, CommonManager, match} = require('../../helpers/helpers');
const {TaskSerializer, UserSerializer, TaskDeserializer,
  MessageSerializer, relationshipsFix } = require('../../app/adapters/json-api');
var router = express.Router();

router.patch('/tasks/:id', function (req, res) {
  CommonManager.getPostData(req, res)
    .then(data => TaskDeserializer.deserialize(data))
    .then(data => {
      let id = req.get('api-key');
      let {year, month} = datas(req);
      let name = data.name.replace(' ', '_');
      //Create object for changing days in month
      var $set = { $set: {} };
      $set.$set['days.' + (data.id - 1) +'.days'] = data.days;
      //query
      Task.update({_userId: id, month, year, days: {$elemMatch: {name}}}, $set)
      .then(task => { res.status(204).json({})});
    }).catch(err => console.log(err));
});

router.post('/tasks', function (req, res) {
  CommonManager.getPostData(req, res).then(data => {
    return TaskDeserializer.deserialize(data).then(data => {
      let id = req.get('api-key'); //|  req.get('api-key');
      data.month = parseInt(data.month);
      data.year = parseInt(data.year);
      data.id = parseInt(data.id);
      delete data.user;
      Task.update({ _userId: id, year: data.year, month:data.month }, { $push: { days: data }})
      .then(data => res.status(204).json({}));
    });
  }).catch(err => console.log(err));
});

router.get('/tasks', function (req, res) {
  let {month} = datas(req);
  let id = req.get('api-key');
  Task.findOne({_userId: id, month}).then(tasks => {
    if (tasks) {
      return res.json(TaskSerializer.serialize(tasks.days));
    }
    return res.json({data: []});
  }).catch(dataBaseError);
});

router.get('/tasks/:id', urlEncoder, function (req, res) {
  let userId = parseInt(req.params.id);
  let {year, month} = datas(req);
  let id = req.get('api-key');
  Task.findOne({_userId: id, month, year}).then(tasks => {
    if (tasks) {
      tasks = tasks.toObject().days[userId -1];
      return res.json(TaskSerializer.serialize(tasks));
    }
    res.json(TaskSerializer.serialize({meta: {title: 'No mored data.'}, data: []}));
  }).catch(d => console.log(d));
});

function dataBaseError(err) {
  return console.error('There was a problem with the database', err);
}


//function for extracting get date parames
function datas(req) {
  let month = (Object.keys(req.query).length) ? req.query.filter.month : moment().month();
  let year = (Object.keys(req.query).length) ? req.query.filter.year : moment().year();
  return {month, year};
}


 function generateDays(schedule, year, month)  {
   year = year || moment().year();
   month = month || moment().month();
   let wholeMonth = moment([year, month]).daysInMonth();
   let dd = moment([year, month]);
   let days = [];
   for (let i = 1; i <= wholeMonth; i++) {
     days.push({
       comlited: 0, day: i,
       tracking: schedule[dd.day()],
     });
     dd.add(1, 'days').day();
   }
   return days;
 }
module.exports = router;
