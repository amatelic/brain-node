const _ = require('lodash');
const synaptic = require('synaptic');
const Graph = require('./graph');
const Layer = synaptic.Layer;
const Network = synaptic.Network;
const Architect = synaptic.Architect;
var stagesNet = new Architect.Perceptron(5, 7, 5);

var trainingSet = [
  {
    input: [0, 1, 0, 0, 1],
    output: [0, 0, 1, 0, 0]
  },
  {
    input:  [1, 0, 0, 0, 1],
    output: [0, 1, 0, 0, 0]
  },
  {
    input:  [0, 0, 1, 0, 1],
    output: [0, 0, 0, 1, 0]
  },
  {
    input:  [0, 0, 1, 1, 0],
    output: [0, 0, 0, 0, 1]
  },
  {
    input:  [0, 1, 0, 1, 0],
    output: [1, 0, 0, 0, 0]
  }
];

var trainingOptions = {
  rate: .1,
  iterations: 20000,
  error: .005,
}

stagesNet.trainer.train(trainingSet, trainingOptions);
let habits = ['health','learning', 'social', 'crativity','sport'];
let result = stagesNet.activate([1,0,1,0,0]);
let index = result.indexOf(Math.max(...result));


function newHabit(data) {
  let result = stagesNet.activate([1,0,1,0,0]);
  let index = result.indexOf(Math.max(...result));
  return habits[index];
}

let obj = { sport: 0, health: 0, learn: 0, social: 0, creativity: 0 };

function stages(data, classifier) {
  return data.reduce((p, n) => {
    let category = classifier.classify(n);
    p[category]++;
    return p;
  }, obj);
}

function newSkill(data, size) {
  let procantage = {};
  let total = _.toArray(data).reduce((p, n) => p + n, 0);
  for (type in data) {
    procantage[type] = (data[type] * 100) / total
  }
  // console.log(procantage)
}

module.exports = {
  stages,
  newSkill,
  newHabit,
};
