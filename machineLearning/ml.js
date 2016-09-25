let Recommending = require('./recomend');
let Improve = require('./improve');

let anze = [0,1,1,1,0,0,0,0,0,0];
let activities = ['learning french', 'suburi', 'read_book', 'make videos'];
console.log(Recommending.network.predict(anze))
Recommending.bayes.predict(activities).then(d => console.log(d))
// console.log(results)
