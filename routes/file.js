var express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const {addMeta} = require('../helpers/helpers');
const {Quote} = require('../db/db');
var router = express.Router();
const { QuoteSerializer, UserSerializer } = require('../app/adapters/json-api');

// define the home page route
router.get('/', function(req, res) {
  fs.readFile(path.resolve(__dirname, '../files/09.csv'), 'utf-8', (err, data) => {
    if (err) throw err;
    let rows = data.split(os.EOL);
    convert = rows.map( d => {
      let columns = d.split(',')
      let days = columns.map((d, i) => {
        return tasksObject(i, true, d)
      });
      return {
        name: columns[0], year: 2016, month: 8, days,
        "schedule" : [true,true,true,true,true,true,true],
    };
    });
    res.json(convert.slice(1, convert.length -1 ));
  });
});

function tasksObject(day = 0, track = false, complited = 1) {
  return {
    "tracking": track,
    "complited": parseInt(complited),
    "day": day,

  }
}

module.exports = router;
