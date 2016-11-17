var mongoose = require('mongoose');
const moment = require('moment');
var Schema = mongoose.Schema;
let Task = mongoose.model("Task");


let Users = Schema({
  username: String,
  name:   String,
  email:  String,
  image: String,
  created: { type: Date, default: Date.now },
  plan: { type: String, default: 'basic' },
  data: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

Users.statics.new = function (data) {
  data.image = 'http://localhost:5000/public/images/unknown_user.jpg'
  this.create(data, (err, user) => {
    if (err) { return new Error('Could not create user'); }

    var task = new Task({_userId: user._id});
    task.save((err) => new Error('Task was not created'));
  });
}

Users.statics.getTasks = function(id) {
  let year = moment().year();
  let month = moment().month();
  return Task.findOne({_userId: id, year, month})
             .then(getRealtion('task'));
}

function getRealtion(task) {
  let prural = task + 's';
  return (tasks) => {
    tasks = (tasks) ? tasks : {days: []};
    return {
      tasks: getNames(tasks),
      relations: {
        [prural]: {
          'links': links(prural),
          'data': getTasks(tasks),
        }
      }
    }
  }
}

function getNames(tasks) {
  return tasks.days.map(task => task.name.replace('_', ' '));
}

function getTasks(tasks) {
  return tasks.days.map((d, i) => {
    return {'type': "task", 'id': d.id };
  });
}

function links(prural) {
  return {
    "links": {
      "self": `http://localhost:5000/api/${prural}`,
      "related": `http://localhost:5000/api/${prural}`,
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
