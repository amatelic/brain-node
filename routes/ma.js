var express = require('express');
const lda = require('lda');
const fs = require('mz/fs');
const request = require('request');
const natural = require('natural');
const Brain = require('../machineLearning/stages');
const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();
const {User, Task, Message} = require('../db/db');
const _ = require('lodash');
var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

//creating function for working with no data from database
// define the home page route
router.get('/', function(req, res) {
  User.findOne({ "email" : "amatelic93@gmail.com"}).then(user => {
      return Promise.all([
        Promise.resolve(user),
        Task.findOne({_userId: user._id, month: 8}),
        Message.find({_userId: user._id}),
    ]);}).then(data => {
      let tasks = data[1].toObject();
      let active = tasks.tasks.active.map(d => d.replace('_', ' '));
      return Brain.stageClassifier(active).then(stages => {
        let binaryData = Brain.convertToBinaryStages(stages);
        let newSkill = Brain.newHabit(binaryData);
        res.render('learning/index', {
          user: data[0], messages: data[2],
          tasks, stages, newSkill
        });
      })
    }).catch(err => {console.log(err, 1)})
});
// define the about route
router.get('/machine', function(req, res) {
  Promise.all([
    fs.readFile('./files/text/pickup.txt', 'utf8'),
    Promise.resolve(User.findOne({ "email" : "amatelic93@gmail.com"}))
  ]).then(data => {
      ldaData = lda(tokenizer.tokenize(data[0]), 3, 5);
      res.render('learning/lda', {
        user: data[1], ldaData, text: data[0]
      });
    }).catch(d => console.log(d));
});

router.get('/fiveStages', function(req, res) {
  User.findOne({ "email" : "amatelic93@gmail.com"})
    .then(user => Promise.all([
      Promise.resolve(user),
      Task.findOne({_userId: user._id, year: 2016, month: 8})
    ])).then(data => {
      let tasks = data[1].toObject();
      let active = tasks.tasks.active.map(d => d.replace('_', ' '));
      Brain.stageClassifier(active).then(tasks => {
        res.render('learning/five', {
          user: data[0],
          tasks: tasks,
          active: active.map(d => d.replace('_', ' ')),
        });
      })
    }).catch(err => console.log(err));

});
module.exports = router;
