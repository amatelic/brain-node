const express = require('express');
const Error = require('../../app/config/errors');
const Stages = require('../../machineLearning/stages');
const urlEncoder = require('body-parser').urlencoded({ extended: false });
const {addMeta, ErrorMessage} = require('../../helpers/helpers');
const {User, Task, Quote} = require('../../db/db');
const {CommonManager, match} = require('../../helpers/helpers');
const {UserSerializer } = require('../../app/adapters/json-api');

var router = express.Router();

router.get('/users/:id', function (req, res) {
  const id = req.params.id;
  Promise.all([
    User.findOne({_id: id}),
    Quote.random(),
    User.getTasks(id),
  ]).then(data => {
    user = UserSerializer.serialize(data[0].toObject());
    let {tasks, relations} = data[2];
    Stages.stageClassifier
    Stages.stageClassifier(tasks).then(stages => {
      user = addMeta(user, {
        meta: {
          quote: data[1],
          stages,
        }
      });
      //Bug fix for relations
      user.data.relationships = relations;
      res.json(user);
    });
    // console.log(Stages.stageClassifier(tasks))
  }).catch(e => console.log(e));
});

router.patch('/users/:id', function (req, res) {
  CommonManager.getPostData(req, res).then(data => {
    res.status(204).json({data: []});
  });
});

function getUserData(user, tasks, callback) {
  User.findOne(user).then(user => {
    Task.find(Object.assign({_userId: user._id}, tasks))
    .then(task => { callback(user, task); });
  });
}

router.post('/register', urlEncoder, function (req, res) {
  let {email, password} = req.body;
  match(User, {email},
    (user) => res.status(409).nojson(Error.user['user-exsist']),
    (_) => {
      User.new(req.body);
      return res.json(Error.user['created']);
    }
  );
});

router.post('/token', function(req, res) {
  let {username, password} = req.body;
  match(User, {email: username},
    (user) => res.json({ 'access_token': user._id, 'user_id': user._id }),
    (_) => res.status(401).json({errors: [Error.user['no-user']]})
  );
});


module.exports = router;
