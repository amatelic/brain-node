const natural = require('natural');
const co = require('co');
const fs = require('fs');
const stage = JSON.parse(fs.readFileSync('./stages.json', 'utf-8'));
const {getData, getAllData} = require('./machineLearning/helpers');
const {stages, newSkill, newHabit} = require('./machineLearning/stages');
// let classifier = new natural.BayesClassifier();
let DecisionTree = require('decision-tree');
let classifier =  natural.BayesClassifier.restore(stage);
classifier.train();
co(function * () {
    let classifierData =  yield getAllData();
});

let value = classifier.classify('cooking');

let dataset = ['playing piano','drinking water', 'cooking', 'running', 'talk to a stranger'];
dataset.map(d => {
  console.log(d, classifier.classify(d))
})
let a = stages(dataset, classifier);
console.log(a)
console.log(newHabit(a));
