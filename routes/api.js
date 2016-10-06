// const _ = require('lodash');
// const express = require('express');
// const moment = require('moment');
// const Error = require('../app/config/errors');
// const Stages = require('../machineLearning/stages');
// const urlEncoder = require('body-parser').urlencoded({ extended: false });
// const {addMeta, ErrorMessage} = require('../helpers/helpers');
// const {User, Task, Message, Quote} = require('../db/db');
// const {setUrl, CommonManager, match} = require('../helpers/helpers');
// const {TaskSerializer, UserSerializer, TaskDeserializer,
//   MessageSerializer, relationshipsFix } = require('../app/adapters/json-api');
// var router = express.Router();
//
//
// // router.get('/messages/:id', function (req, res) {
// //   let id = req.params.id;
// //   Message.find({_id: id}).then(d => {
// //     res.json(MessageSerializer.serialize(setUrl(d[0], 'image')));
// //   }).catch(err => {data: []});
// // });
// //
// // router.get('/messages/:id', function (req, res) {
// //   let id = req.params.id;
// //   Message.find({_id: id}).then(d => {
// //     res.json(MessageSerializer.serialize(setUrl(d[0], 'image')));
// //   }).catch(err => {data: []});
// // });
//
// function getUserData(user, tasks, callback) {
//   User.findOne(user).then(user => {
//     Task.find(Object.assign({_userId: user._id}, tasks))
//     .then(task => { callback(user, task); });
//   });
// }
//
// router.post('/register', urlEncoder, function (req, res) {
//   let {email, password} = req.body;
//   match(User, {email},
//     (user) => res.status(409).nojson(Error.user['user-exsist']),
//     (_) => {
//       var newUser = new User(req.body);
//       newUser.save(ErrorMessage);
//       var story = new Task({_userId: newUser._id,});
//       story.save(ErrorMessage);
//       return res.json(Error.user['created']);
//     }
//   );
// });
//
// router.post('/token', function(req, res) {
//   let {username, password} = req.body;
//   match(User, {email: username},
//     (user) => res.json({ 'access_token': user._id, 'user_id': user._id }),
//     (_) => res.status(401).json({errors: [Error.user['no-user']]})
//   );
// });
//
// router.patch('/tasks/:id', function (req, res) {
//   CommonManager.getPostData(req, res)
//     .then(data => TaskDeserializer.deserialize(data))
//     .then(data => {
//       let id = req.get('api-key');
//       let {year, month} = datas(req);
//       let name = data.name.replace(' ', '_');
//       //Create object for changing days in month
//       var $set = { $set: {} };
//       $set.$set['days.' + (data.id - 1) +'.days'] = data.days;
//       //query
//       Task.update({_userId: id, month, year, days: {$elemMatch: {name}}}, $set)
//       .then(task => { res.status(204).json({})});
//     }).catch(err => console.log(err));
// });
//
// router.post('/tasks', function (req, res) {
//   CommonManager.getPostData(req, res).then(data => {
//     return TaskDeserializer.deserialize(data).then(data => {
//       let id = req.get('api-key'); //|  req.get('api-key');
//       data.month = parseInt(data.month);
//       data.year = parseInt(data.year);
//       data.id = parseInt(data.id);
//       delete data.user;
//       Task.update({ _userId: id, year: data.year, month:data.month }, { $push: { days: data }})
//       .then(data => res.status(204).json({}));
//     });
//   }).catch(err => console.log(err));
// });
//
// router.get('/tasks', function (req, res) {
//   let {month} = datas(req);
//   let id = req.get('api-key');
//   Task.findOne({_userId: id, month}).then(tasks => {
//     if (tasks) {
//       return res.json(TaskSerializer.serialize(tasks.days));
//     }
//     return res.json({data: []});
//   }).catch(dataBaseError);
// });
//
// router.get('/tasks/:id', urlEncoder, function (req, res) {
//   let userId = parseInt(req.params.id);
//   let {year, month} = datas(req);
//   let id = req.get('api-key');
//   Task.findOne({_userId: id, month, year}).then(tasks => {
//     if (tasks) {
//       tasks = tasks.toObject().days[userId -1];
//       return res.json(TaskSerializer.serialize(tasks));
//     }
//     res.json(TaskSerializer.serialize({meta: {title: 'No mored data.'}, data: []}));
//   }).catch(d => console.log(d));
// });
//
// function dataBaseError(err) {
//   return console.error('There was a problem with the database', err);
// }
//
//
// function datas(req) {
//   let month = (Object.keys(req.query).length) ? req.query.filter.month : moment().month();
//   let year = (Object.keys(req.query).length) ? req.query.filter.year : moment().year();
//   return {month, year};
// }
//
//
// /**
//  * Testing purpose
//  */
//
//  router.get('/test', function(req, res) {
//    Task.findOne({_userId: '57d8054a2813b26d3a2e5189', month: 8, year: 2016}).then(tasks => {
//       let time = moment();
//       //.add(1, 'month')
//       let newMonth = tasks.days.map((d) => {
//           return {
//             id: d.id,
//             name: d.name,
//             time: d.time,
//             schedule: d.schedule,
//             month: time.month(),
//             year: time.year(),
//             days: generateDays(d.schedule, time.year(), time.month())
//           };
//       });
//       var story = new Task({
//         _userId: '57d8054a2813b26d3a2e5189',
//         month: time.month(),
//         year: time.year(),
//         days: newMonth,
//       });
//       story.save(ErrorMessage);
//        res.json(newMonth);
//    }).catch(err => console.log(err));
//
//  });
//
//  function generateDays(schedule, year, month)  {
//    year = year || moment().year();
//    month = month || moment().month();
//    let wholeMonth = moment([year, month]).daysInMonth();
//    let dd = moment([year, month]);
//    let days = [];
//    for (let i = 1; i <= wholeMonth; i++) {
//      days.push({
//        comlited: 0, day: i,
//        tracking: schedule[dd.day()],
//      });
//      dd.add(1, 'days').day();
//    }
//    return days;
//  }

// module.exports = router;
