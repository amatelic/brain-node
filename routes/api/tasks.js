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
    .then(data => Task.updateRecord(data, getData(req)))
    .then(task => res.status(204).json({}))
    .catch(err => console.log(err));
});

router.post('/tasks', function (req, res) {
  CommonManager.getPostData(req, res)
    .then(data => TaskDeserializer.deserialize(data))
    .then(data => Task.new(data, req))
    .then(data => res.status(204).json({}))
    .catch(err => console.log(err));
});

router.get('/tasks', function (req, res) {
  let {month} = getData(req);
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
  let {year, month} = getData(req);
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
function getData(req) {
  let id = req.get('api-key');
  let month = (Object.keys(req.query).length) ? req.query.filter.month : moment().month();
  let year = (Object.keys(req.query).length) ? req.query.filter.year : moment().year();
  return {id, month, year};
}


module.exports = router;
