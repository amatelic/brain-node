const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const urlEncoder = bodyParser.urlencoded({ extended: false });
const json = bodyParser.json();
const {User, Task, Message} = require('../db/db');
const {setUrl, CommonManager} = require('../helpers/helpers');
const {TaskSerializer, UserSerializer, TaskDeserializer,
  MessageSerializer, relationshipsFix } = require('../app/adapters/json-api');

var router = express.Router();

router.get('/users/:id', function (req, res) {
  const id = req.params.id;
  User.findOne({_id: id}).then(user => {
    user = UserSerializer.serialize(user.toObject());
    //Fix for relationship adding
    user.data.relationships = relationshipsFix(id);
    res.json(user);
  }).catch(e => console.log(e));
});

router.get('/messages/:id', function (req, res) {
  let id = req.params.id;
  Message.find({_id: id}).then(d => {
    res.json(MessageSerializer.serialize(setUrl(d[0], 'image')));
  }).catch(err => {data: []});
});


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

function getUserData(user, tasks, callback) {
  User.findOne(user).then(user => {
    Task.find(Object.assign({_userId: user._id}, tasks))
    .then(task => { callback(user, task); });
  });
}

router.post('/register', bodyParser.urlencoded({ extended: true }), function (req, res) {
  let {email, password} = req.body;
  Task.findOne({email}).then(user => {
    if (user) {
      return res.json({text: 'Sorry the user already exsists'});
    }
    var newUser = new User(req.body);
    newUser.save(err => console.log(err));
    var story1 = new Task({
      year: 2016,
      month: 08,
      _userId: newUser._id    // assign the _id from the person
    });
    story1.save(err => console.log(err));
    return res.json({text: 'User was created.'});
  });
});

router.post('/token', function(req, res) {
  let {username, password} = req.body;
  User.findOne({email: username}).then(user => {
    res.json({
      'access_token': user.email,
      'user_id': user._id
    });
  });
});

router.patch('/tasks/:id', function (req, res) {
  CommonManager.getPostData(req, res)
    .then(data => TaskDeserializer.deserialize(data))
    .then(data => {
      let id = '57d8054a2813b26d3a2e5189';
      let month = moment().month();
      let year = moment().year();
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
    let id = '57d8054a2813b26d3a2e5189'; //|  req.get('api-key');
    let month = parseInt(data.month);
    let year = parseInt(data.year);
    delete data.user;
    Task.update({ _userId: id, year, month }, { $push: { days: data }})
    .then(data => res.status(204).json({}));
  });
});

router.get('/tasks', function (req, res) {
  let month = (Object.keys(req.query).length) ? req.query.filter.month: 8;
  let id = '57d8054a2813b26d3a2e5189';
  Task.findOne({_userId: id, month}).then(tasks => {
    if (tasks) {
      return res.json(TaskSerializer.serialize(tasks.days));
    }
    return res.json({data: []});
  }).catch(dataBaseError);
});

router.get('/tasks/:id', urlEncoder, function (req, res) {
  let userId = parseInt(req.params.id);
  let month = (Object.keys(req.query).length) ? req.query.filter.month : 8;
  let id = '57d8054a2813b26d3a2e5189';
  Task.findOne({_userId: id, month}).then(tasks => {
    if (tasks) {
      tasks = tasks.toObject().days[userId -1];
      return res.json(TaskSerializer.serialize(tasks));
    }
    res.json(TaskSerializer.serialize({meta: {title: 'No mored data.'}, data: []}));
  }).catch(dataBaseError);
});

function dataBaseError(err) {
  return console.error('There was a problem with the database', err);
}

function tasksObject(day = 0, track = false, complited = 1) {
  return {
    "tracking": track,
    "complited": parseInt(complited),
    "day": day,
  };
}

function convertData(obj, month, year) {
  let dates = [ "January", "February", "March", "April", "May", "June", "July",
        "August", "September" ];
  return obj.months[dates[month]].map((d, i)=> {
    d._id = i,
    d.month = month;
    d.year = year;
    return d;
  });
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
