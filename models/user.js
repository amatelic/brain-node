var mongoose = require('mongoose');
const moment = require('moment');
var Schema = mongoose.Schema;
let Task = mongoose.model("Task");

let Users = Schema({
  username: String,
  name:   String,
  email:  String,
  created: { type: Date, default: Date.now },
  plan: { type: String, default: 'basic' },
  data: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  //{type: mongoose.Schema.ObjectId, default: mongoose.Types.ObjectId },
});

Users.statics.getTasks = function(id) {
  let year = moment().year();
  let month = moment().month();
  return Task.find({_userId: id, year, month})
  .then(relation('task', (d) => d[0].days.map((d, i) => ({'type': "task", 'id': i + 1 }))));
}


function relation(type, callback) {
  let obj = {};
  let prural = type + 's';
  return (d, i) => {
    let data = callback(d, i);
    return {
      [prural]: {
          "links": {
            "self": `http://localhost:5000/api/${prural}`,
            "related": `http://localhost:5000/api/${prural}`,
          },
          data
      }
    }
  };

}

// "tasks": {
//   "links": {
//     "self": "http://localhost:5000/api/tasks",
//     "related": "http://localhost:5000/api/tasks",
//   },
//   "data": [
//     {type: "task", "id": 1},
//     {type: "task", "id": 2},
//     {type: "task", "id": 3},
//     {type: "task", "id": 4},
//     {type: "task", "id": 5},
//     {type: "task", "id": 6},
//   ]
// },

mongoose.model("Users", Users);
