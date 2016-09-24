const _ = require('lodash');
const express = require('express');
const moment = require('moment');
const urlEncoder = require('body-parser').urlencoded({ extended: false });
const {addMeta, ErrorMessage} = require('../helpers/helpers');
const {User, Task, Message, Quote} = require('../db/db');
const {setUrl, CommonManager} = require('../helpers/helpers');
const {TaskSerializer, UserSerializer, TaskDeserializer,
  MessageSerializer, relationshipsFix } = require('../app/adapters/json-api');

var router = express.Router();

router.get('/users/:id', function (req, res) {
  const id = req.params.id;
  Promise.all([
    User.findOne({_id: id}),
    Quote.random(),
    User.getTasks(id),
  ]).then(data => {
    user = UserSerializer.serialize(data[0].toObject());
    user = addMeta(user, {meta: data[1]});
    //Bug fix for relations
    user.data.relationships = data[2];
    res.json(user);
  }).catch(e => console.log(e));
});

router.patch('/users/:id', function (req, res) {
  CommonManager.getPostData(req, res).then(data => {
    res.status(204).json({data: []});
  });
});

router.get('/messages/:id', function (req, res) {
  let id = req.params.id;
  Message.find({_id: id}).then(d => {
    res.json(MessageSerializer.serialize(setUrl(d[0], 'image')));
  }).catch(err => {data: []});
});


// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

function getUserData(user, tasks, callback) {
  User.findOne(user).then(user => {
    Task.find(Object.assign({_userId: user._id}, tasks))
    .then(task => { callback(user, task); });
  });
}

router.post('/register', urlEncoder, function (req, res) {
  let {email, password} = req.body;
  User.findOne({email}).then(user => {
    if (user) return res.json({text: 'Sorry the user already exsists'});

    var newUser = new User(req.body);
    newUser.save(ErrorMessage);
    var story = new Task({_userId: newUser._id,});
    story.save(ErrorMessage);
    return res.json({text: 'User was created.'});
  }).catch(ErrorMessage);
});

router.post('/token', function(req, res) {
  let {username, password} = req.body;
  User.findOne({email: username}).then(user => {
    res.json({
      'access_token': user._id,
      'user_id': user._id
    });
  });
});

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


function datas(req) {
  let month = (Object.keys(req.query).length) ? req.query.filter.month : moment().month();
  let year = (Object.keys(req.query).length) ? req.query.filter.year : moment().year();
  return {month, year};
}


/**
 * Testing purpose
 */

 router.get('/test', function(req, res) {
   let user = { email: 'amatelic94@gmail.com' };
   let userData = {year: 2016, month: 8};
   getUserData(user, userData, (user, task) => {
     res.send('test');
   });
 });

module.exports = router;
