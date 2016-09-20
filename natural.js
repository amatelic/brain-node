const natural = require('natural');
const cheerio = require('cheerio');
const data = require('./helpers/data');
const fs = require('fs');
const classifier = new natural.BayesClassifier();

const toDOM = (d) => cheerio.load(d);
let health = [
  ['Write down three good things that happened to you each day.', 'health'],
  ['Get some sun.', 'health'],
  ['Write down three good things that happened to you each day.', 'health'],
  ['Breathe deeply for at least two minutes. Focus on your breaths.', 'health'],
  ['Take a nap', 'health'],
  ['Weigh Yourself Every Day', 'health'],
  ['Have a Glass of Cold Water with Lemon', 'health']
];
let socialize = [
  ['Talk with a positive person.', 'social'],
  ['Ask for a hug from one person a day.', 'social'],
  ['Call an old friend or relative.', 'social'],
  ['Talk to a friend for ten minutes, even if just to hear about his or her life', 'social'],
];

let sport = [

];

let creativity = [
  ['Origami', 'creativity'],
  ['Calligraphy', 'creativity'],
  ['Gardening', 'creativity'],
  ['Bonsai sculpture', 'creativity'],
  ['Pooktre', 'creativity'],
  ['Magic', 'creativity'],
  ['Photography', 'creativity'],
  ['Writing poetry', 'creativity'],
  ['Writing prose', 'creativity'],
  ['Puppet Master', 'creativity'],
  ['Sewing', 'creativity'],
  ['Knitting', 'creativity'],
  ['Sculpture', 'creativity'],
  ['Sculpture ', 'creativity'],
  ['Woodcarving', 'creativity'],
  ['Painting water colours', 'creativity'],
  ['Painting pastels', 'creativity'],
  ['Oil painting', 'creativity'],
  ['Painting paint by number', 'creativity'],
  ['Glass painting', 'creativity'],
  ['Glass painting', 'creativity'],
  ['How to Make Great Videos', 'creativity'],
]
let learning = [
  ['Basic First Aid Skills', 'learn'],
  ['Cooking Skills', 'learn'],
  ['How to Read Faster', 'learn'],
  ['Public Speaking', 'learn'],
  ['Basic Psychology', 'learn'],
  ['Body Language', 'learn'],
  ['How to Budget Properly', 'learn'],
  ['Learn a New Language', 'learn'],
  ['Learn a New Instrument', 'learn'],
  ['How to Cover Your Tracks on the Internet', 'learn'],
  ['Adobe Creative Suite', 'learn'],
  ['Microsoft Office Suite', 'learn'],
  ['Improve Your Memory', 'learn'],
  ['How to Do Mental Math', 'learn'],
  ['Touch Typing', 'learn'],
  ['Learn Computers', 'learn'],
  ['Learn Electronics', 'learn'],
  ['Learn mechanical engineering', 'learn'],
  ['Read a book', 'learn'],
]
natural.BayesClassifier.load('five.json', null, function(err, classifier) {

    health.forEach(d => {
      classifier.addDocument(d[0], d[1])
    });

    socialize.forEach(d => {
      classifier.addDocument(d[0], d[1])
    });
    classifier.train();
    classifier.save('five.json', function (e,d) {
      console.log(e,d)
    });
});
