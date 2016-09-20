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

router.post('/tasks', function (req, res) {
  CommonManager.getPostData(req, res, function (data) {
    let id = '57d8054a2813b26d3a2e5189'; //|  req.get('api-key');
    let month = parseInt(data.month);
    let year = parseInt(data.year);
    delete data.user;
    Task.update({ _userId: id, year, month }, { $push: { days: data }}, function(err, data) {
      console.log(err, data)
      res.status(204).json({});
    });
  });


  // DB.update('user', {
  //   email,
  //   'directories.name': `${directory}`
  // },{
  //   $push: {
  //     'directories.$.music':  data,
  // }});

  // Task.findOne({_userId: id, month: 8}).then(tasks => {
  //   // let data = convertData(d.toObject(), 8, 2016);
  //   res.json(TaskSerializer.serialize(tasks));
  // }).catch(d => console.log(d));
});

router.get('/tasks', function (req, res) {
  let month = (Object.keys(req.query).length) ? req.query.filter.month - 1 : 8;
  let id = '57d8054a2813b26d3a2e5189';
  Task.findOne({_userId: id, month}).then(tasks => {
    // let data = convertData(d.toObject(), month, 2016);
    res.json(TaskSerializer.serialize(tasks.days));
  }).catch(dataBaseError);
});

router.get('/tasks/:id', urlEncoder, function (req, res) {
  let userId = req.params.id;
  let month = (Object.keys(req.query).length) ? req.query.filter.month : 8;
  let id = '57d8054a2813b26d3a2e5189';
  Task.findOne({_userId: id, month}).then(tasks => {
    tasks = tasks.toObject().days[userId - 1],
    res.json(TaskSerializer.serialize(tasks));
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
