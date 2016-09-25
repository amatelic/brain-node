const data = require('./training/user');
const {Architect} = require('synaptic');
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

// for (month of months) {
//   let dd = network.activate(month).map(d => Math.round(d));
//   console.log(dd)
//   if (dd.includes(1)) {
//     let emotion = dd.indexOf(1);
//     console.log(emotions[emotion])
//   }
// }


module.exports = {
  API: d => console.log(d)
}
