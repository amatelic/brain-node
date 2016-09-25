//Neural network for comparing user and recomeding new tasks
const fs = require('fs');
const _ = require('lodash');
const natural = require('natural');
const {Architect} = require('synaptic');
const { stageClassifier, newHabit } = require('./stages');

const hopfield = new Architect.Hopfield(10) // create a network for 10-bit patterns
let users = {
  rok:[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  tomaz:[1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
}
// teach the network two different patterns
hopfield.learn(_.toArray(users));

module.exports = {
  network: {
    train(data) {
      if (_.isObject(data)) {
        data = _.isArray(data) ? data : _.toArray(data);
        hopfield.learn(data);
      }
    },
    predict(newData) {
      return hopfield.feed(newData);
    }
  },
  bayes: {
    predict(tasks) {
      return stageClassifier(tasks).then(data => {
        return newHabit(_.toArray(data))
      })
      .catch(err => console.log(err));
    }
  }
}
