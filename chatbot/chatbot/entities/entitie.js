const defaultEntities = require('./entitieTypes');
const natural = require('natural'),
  tokenizer = new natural.WordTokenizer();
// fruit.match(/^(banana|lemon|mango|pineapple)$/

let deafultOptions = {
  toLowerCase: false,
}

class Entities {
  constructor(entities = defaultEntities, options) {
    this.entities = entities
    this.config = Object.assign(deafultOptions, options)
  }

  addEntite(label,  obj) {
    this.entities[label] = obj;
  }

  text(words) {
    if (!Array.isArray(words)) {
      return tokenizer.tokenize(words);
    }

    return words.map(word => (typeof word === 'string') ? word : word.value);
  }

  textWithEntities(words) {
    return words.map(word => (typeof word === 'string') ? word : word.entitie);
  }

  entites(words) {
    return words.filter((word) => (typeof word === 'object'));

  }

  textToEntities(text) {
    text = (this.config.toLowerCase) ? text.toLowerCase() : text;
    return tokenizer.tokenize(text).map(word => {
      let newValue;
      let priority = 0;
      for (let label of Object.keys(this.entities)) {
        let entitie = this.entities[label]['fn'](word);
        if (entitie && this.entities[label].priority > priority) {
          newValue = label;
          priority = entitie.priority;
        }
      }
      return newValue ? {entitie: newValue, value: word} : word;
    });
  }
}


module.exports = Entities
