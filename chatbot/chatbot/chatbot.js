const Intents = require('./intents/intent');
const Entities = require('./entities/entitie');
const defaultEntities = require('./entities/entitieTypes');
const response = require('./responses/user');
var stdin = process.openStdin();

let entitie = new Entities(defaultEntities);


class Chatbot {
  constructor(intents) {
    this.intents = intents;
    this.stack = [];
  }
  say(text) {
    text = text.toLowerCase();
    let entitieText = entitie.textToEntities(text);
    let entities = entitie.textToEntities(text);
    text = entitie.textWithEntities(entities);
    this.stack.push(entitieText);
    let rawText = text.join(" ");
    return this.intents.loadClassifier()
                .then(classifier => ({
                  entitie: entitieText,
                  classifier: classifier,
                  intent: classifier.classify(rawText)
                }));
  }
}

module.exports = Chatbot;
