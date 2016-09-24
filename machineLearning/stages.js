const _ = require('lodash');
const synaptic = require('synaptic');
const {trainingData, options} = require('../data/network');
const Architect = synaptic.Architect;
const natural = require('natural');
let habits = ['health','learn', 'social', 'creativity','sport'];
let obj = { sport: 0, health: 0, learn: 0, social: 0, creativity: 0 };
const classifier = new natural.BayesClassifier();
var stagesNet = new Architect.Perceptron(5, 7, 5);


stagesNet.trainer.train(trainingData, options);
let result = stagesNet.activate([1,0,1,0,0]);
let index = getMaxIndex(result);


function getMaxIndex(collection) {
  return collection.indexOf(Math.max(...collection))
}

function convertToBinaryStages(data) {
  return habits.map(label => data[label]);
}

/**
 * Function for recomending new habit with neural networks
 * @param {array} data  -> data has to be binary form [0, 1, 0, 1]
 * @return {String}
*/
function newHabit(data) {
  let result = stagesNet.activate(data);
  let index = getMaxIndex(result);
  return habits[index];
}


/**
 * Function for classifing data and returning
 * @result {sport: 0, health: 0, creativity: 0, learn: 0, social: 0}
 * @param {array} data
 * @param {classification object} classifier
 * @return {Object}
 */
function stages(data, classifier) {
  return data.reduce((p, n) => {
    let category = classifier.classify(n);
    p[category]++;
    return p;
  }, _.cloneDeep(obj));
}

/**
 * Method for getting stage classification
 * @param {array} data
 * @return {Promise< Object >}
 */
function stageClassifier(data) {
  return new Promise((resolve, rejected) => {
    natural.BayesClassifier.load('./stages.json', null, function(err, classifier) {
      if (err) {
        rejected(err);
      }
      resolve(stages(data, classifier));
    });
  });
}

module.exports = {
  stages,
  newHabit,
  stageClassifier,
  convertToBinaryStages
};
