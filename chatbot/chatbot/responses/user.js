const Entities = require('../entities/entitie');
let entitie = new  Entities();
module.exports = {
  'hi': function() {
    return 'Hi how are you';
  },
  'finish task': function(data) {
    let task = entitie.entites(data).filter(word => word.entitie === '@task');
    if (task[0]) {
      return `Should I checkout the ${task[0].value} task.`
    } else {
      return 'Awssome which one';
    }
  },
  emotion() {
    return 'Exelent, what would you like to do';
  },
  'condition': function(data) {
    let condition = entitie.entites(data).filter(word => word.entitie === '@bool');

    if (condition[0].value === 'yes') {
      return 'Task was checkout';
    } else {
      return 'Task was not checkout'
    }
  },
  'check task': function(data) {
    return data, 'Taks was checkout';
  },

  question() {
    let tasks = ['ask question about task', 'checkout task'];
    return tasks.reduce((p, task) => {
      p += `* -> ${task} \n`;
      return p;
    }, 'Informations:\n');
  },

  'goodbye': function(data) {
    return 'see you later';
  },

  information() {
    return 'i dind\'t find any data about this.';
  }
};
