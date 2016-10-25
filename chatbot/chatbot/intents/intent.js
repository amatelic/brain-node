// const defaultEntities = require('./entitieTypes');
const natural = require('natural')
const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

let deafultOptions = {
  toLowerCase: false,
}

class Intent {
  constructor() {
    this.collection = [];
  }
  addValue(text) {
    this.collection.push(text);
  }
}

class Intents {
  constructor(file, bool) {
    this.filename = file;
    this.intents = {};
  }

  addIntent(intent, text) {
    if (!this.intents[intent]) {
      this.intents[intent] = new Intent();
    }

    this.intents[intent].addValue(text);
  }

  classify(text) {
    return new Promise((response, rejected) => {
      natural.BayesClassifier.load(this.filename, null, function(err, classifier) {
          if (err) {
            return rejected(err);
          }

          return response(classifier);
      });
    });
  }

  getIntents() {
    return Object.keys(this.intents);
  }

  saveToClassifier(file) {

    let classifier = new natural.BayesClassifier();
    for (let intent of Object.keys(this.intents)) {
      let label = this.intents[intent];
      label.collection.forEach(text => {
        classifier.addDocument(text, intent);
      });
    }

    classifier.train();
    return new Promise((response, rejected) => {
      classifier.save(file, function(err, classifier) {
        if (err) {
          rejected(err);
        }
        response(classifier);
      });
    });
  }

  loadClassifier() {
    return new Promise((response, rejected) => {
      natural.BayesClassifier.load(this.filename, null, function(err, classifier) {
        if (err) {
          return rejected(err);
        }
        response(classifier);
      });
    })
  }
}

let UsersIntent = new Intents();

UsersIntent.addIntent('hi', 'hi');
UsersIntent.addIntent('hi', 'hello');
UsersIntent.addIntent('hi', 'hello muti');
UsersIntent.addIntent('hi', 'caw');
UsersIntent.addIntent('hi', 'hey');
UsersIntent.addIntent('hi', 'hiya');
UsersIntent.addIntent('hi', 'howdy');

UsersIntent.addIntent('emotion', 'hi, how are you');
UsersIntent.addIntent('emotion', 'are you happy');
UsersIntent.addIntent('emotion', 'good and you');

UsersIntent.addIntent('condition', 'yes');
UsersIntent.addIntent('condition', 'yes please');
UsersIntent.addIntent('condition', 'no');
UsersIntent.addIntent('condition', 'true');
UsersIntent.addIntent('condition', 'false');
UsersIntent.addIntent('condition', 'of course');
UsersIntent.addIntent('condition', 'no i didn\'t finish');

UsersIntent.addIntent('finish task', 'i finished working on @task');
UsersIntent.addIntent('finish task', 'i complited @task');
UsersIntent.addIntent('finish task', 'i finished @number task');
UsersIntent.addIntent('finish task', 'i complited @number task');

UsersIntent.addIntent('question', 'what can i ask');
UsersIntent.addIntent('question', 'i don\t now what to ask');
UsersIntent.addIntent('question', 'what can i do');


UsersIntent.addIntent('information', 'find information  about @task');
UsersIntent.addIntent('information', 'get data about @task');
UsersIntent.addIntent('information', 'get something about @task');
UsersIntent.addIntent('information', 'how should i learn @task');
UsersIntent.addIntent('information', 'how to learn @task');

UsersIntent.addIntent('check task', 'checkout @task');
UsersIntent.addIntent('check task', 'check @task');
UsersIntent.addIntent('check task', 'check @task, @task, @task');
UsersIntent.addIntent('check task', 'set @task as complited');
UsersIntent.addIntent('check task', 'check @task please');

UsersIntent.addIntent('goodbye', 'Goodbye');
UsersIntent.addIntent('goodbye', 'hello');
UsersIntent.addIntent('goodbye', 'hello muti');
UsersIntent.addIntent('goodbye', 'caw');
UsersIntent.addIntent('goodbye', 'bye');
UsersIntent.addIntent('goodbye', 'bye bye');
UsersIntent.addIntent('goodbye', 'see ya soon');
UsersIntent.addIntent('goodbye', 'see ya later');
UsersIntent.addIntent('goodbye', 'catch ya later');
UsersIntent.addIntent('goodbye', 'check ya later');
UsersIntent.addIntent('goodbye', 'check ya later');
UsersIntent.addIntent('goodbye', 'take care');
UsersIntent.addIntent('goodbye', 'take it easy');
UsersIntent.addIntent('goodbye', 'have a good one');

// UsersIntent.saveToClassifier('userFile.json');
module.exports = Intents;
