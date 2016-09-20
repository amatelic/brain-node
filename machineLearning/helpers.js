const fs = require('mz/fs');
const os = require('os');
const _ = require('lodash');
const sport = './data/five/sport.txt';
const creativity = './data/five/creativity.txt';
const social = './data/five/social.txt';
const healthy = './data/five/healthy.txt';
const learn = './data/five/learn.txt';
function getAllData() {
  return Promise.all([getData(sport), getData(creativity), getData(social),
    getData(healthy), getData(learn),
  ]).then(d => {
    return data = d.reduce((p, n) => {
      let data = _.concat(p, n);
      return data;
    }, []);
  })
  .then(e => e.filter(d => d[1] !== undefined && d[0] !== undefined))
}

function getData(path) {
  return fs.readFile(path, 'utf-8').then(data =>  {
    return data.split(os.EOL)
      .filter(d => d.split(',')[0] !== '')
      .reduce((p, n) => {
      let data = n.split(',');
      p.push([data[0].trim(), data[1].trim()]);
      return p;
    }, []);
  })
  .catch(err => console.log(err));
}


module.exports = {
  getData,
  getAllData,
  CommonManager,
};
