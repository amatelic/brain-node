const natural = require('natural');
const co = require('co');
const fs = require('fs');
const _ = require('lodash');
const stage = JSON.parse(fs.readFileSync('./stages.json', 'utf-8'));
const {getData, getAllData} = require('./machineLearning/helpers');
const {stages, newSkill, newHabit} = require('./machineLearning/stages');
const {Architect} = require('synaptic');
let DecisionTree = require('decision-tree');
let classifier =  natural.BayesClassifier.restore(stage);
classifier.train();
co(function * () {
    let classifierData =  yield getAllData();
});

let value = classifier.classify('cooking');

// let dataset = ['learning french', 'suburi', 'read_book', ];
// let a = stages(dataset, classifier);
// console.log(newHabit(_.toArray(a)));

let week = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];
let targets = [7, 8, 9];
let distractors = [1, 2, 4, 5];
let prompts = [0, 3, 6];
let emotions = ['bad', 'neutral', 'good'];
let months = [
  [0, 0, 0, 0, 0, 0, 0,   1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0,   0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0,   0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0,   0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0,   0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0,   0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0,   0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0,   0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1,   0, 0, 1],
]


var network = new Architect.LSTM(7,6,3);

// network.trainer.train([
//   {input: [1, 0, 0, 1, 0, 0, 1], output: [0, 0, 1]},
//   {input: [1, 0, 0, 0, 0, 0, 0], output: [0, 1, 0]},
//   {input: [0, 0, 0, 1, 0, 0, 0], output: [0, 1, 0]},
//   {input: [0, 0, 0, 0, 0, 0, 1], output: [0, 1, 0]},
//   {input: [0, 0, 0, 0, 0, 0, 0], output: [1, 0, 0]}
// ], {
//   rate: 0.15,
//   length: 9,
//   iterations: 10000,
// });

var results = network.trainer.DSR({
  targets: targets,
  distractors: distractors,
  prompts: [0, 3],
  length: 4,
  iterations: 20000,
  rate: .15,
});

for (month of months) {
  let dd = network.activate(month).map(d => Math.round(d));
  console.log(dd)
  if (dd.includes(1)) {
    let emotion = dd.indexOf(1);
    console.log(emotions[emotion])
  }
}

// console.log(results)





// //Neural network for comparing users
// var hopfield = new Architect.Hopfield(10) // create a network for 10-bit patterns
// let users = {
//   rok:[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
//   tomaz:[1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
// }
// // teach the network two different patterns
// hopfield.learn(_.toArray(users));
//
// // feed new patterns to the network and it will return the most similar to the ones it was trained to remember
// let anze = [0,1,1,1,0,0,0,0,0,0];
// let newUser = hopfield.feed(anze);
//
// for (var user in users) {
//   if (users.hasOwnProperty(user)) {
//     if (_.isEqual(users[user], newUser)) {
//       console.log('Anze is similar to user ' + user)
//     }
//   }
// }
// console.log(newUser)
