var express = require('express');
const lda = require('lda');
const fs = require('fs');
const request = require('request');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();
const {User, Task} = require('../db/db');
const _ = require('lodash');
var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  User.find({ "email" : "amatelic93@gmail.com"}, (err, user) =>  {
    Task.findById(user[0].data, (err, tasks) => {
      res.render('learning/index', {
        user: user[0],
        tasks: tasks.toObject()
      });
    });

  });
});
// define the about route
router.get('/machine', function(req, res) {
  // var text = 'Cats are small. Dogs are big. Cats like to chase mice. Dogs like to eat bones.';
  // ldaData = lda(tokenizer.tokenize(text), 3, 5);
  fs.readFile('./files/text/pickup.txt', 'utf8',(err, text) => {
    User.find({ "email" : "amatelic93@gmail.com"},(err, user) => {
      ldaData = lda(tokenizer.tokenize(text), 3, 5);
      res.render('learning/lda', {
        user: user[0],
        ldaData,
        text
      });
    });
  });
});

router.get('/fiveStages', function(req, res) {
  User.find({ "email" : "amatelic93@gmail.com"}, (err, user) =>  {
    Task.findById(user[0].data, (err, tasks) => {
      let data = tasks.toObject();
      let active = data.tasks.active.map(d => d.replace('_', ' '));
      getTypes(active, (data) => {
        res.render('learning/five', {
          user: user[0],
          tasks: data,
          active: active.map(d => d.replace('_', ' ')),
        });
      });
    });
  });
});
module.exports = router;

function getTypes(data, callback) {
  natural.BayesClassifier.load('./five.json', null, function(err, classifier) {
  let obj = {
    'sport': 0,
    'health': 0,
    'learn': 0,
    'social': 0,
    'creativity': 0,
    };
    //create object
    let types= data.reduce((p, n) => {
      console.log(n, classifier.classify(n))
      let category = classifier.classify(n);
      p[category]++;
      return p;
    }, obj);
    console.log(types)
    callback(JSON.stringify(types));
  })
}
