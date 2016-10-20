const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;


/**
 * All Serializer
 */

var TaskSerializer = new JSONAPISerializer('tasks', {
  // id: '_id',
  attributes: ['year', 'month', 'days', 'time','schedule', 'name', 'type']
});

var UserSerializer = new JSONAPISerializer('users', {
  id: '_id',
  meta: { quote: '', author: ''},
  attributes: ['tasks', 'messages','name', 'username', 'image', 'plan', 'auth', 'email'],
});

var MessageSerializer = new JSONAPISerializer('messages', {
  id: '_id',
  attributes: ['title', 'message', 'status', 'image', 'author'],
});

var QuoteSerializer = new JSONAPISerializer('quotes', {
  id: '_id',
  attributes: ['quote', 'author'],
});

/**
 * All Deserializer
 */

var TaskDeserializer = new JSONAPIDeserializer('tasks', {
  // id: '_id',
  attributes: ['year', 'month', 'days', 'time','schedule', 'name', 'type']
});

//relationships fix
function relationshipsFix(id) {
  return {
    "tasks": {
      "links": {
        "self": "http://localhost:5000/api/tasks",
        "related": "http://localhost:5000/api/tasks",
      },
      "data": [
        {type: "task", "id": 1},
        {type: "task", "id": 2},
        {type: "task", "id": 3},
        {type: "task", "id": 4},
        {type: "task", "id": 5},
        {type: "task", "id": 6},
      ]
    },
    "messages": {
      "links": {
        "self": "http://localhost:5000/api/tasks",
        "related": "http://localhost:5000/api/tasks",
      },
      "data": [
        {type: "message", "id": "57dd996a20244820c0eec2cf"},
        {type: "message", "id": "57dda28620244820c0eec2d0"}
      ]
    },
  };
}

module.exports = {
  TaskSerializer,
  UserSerializer,
  MessageSerializer,
  TaskDeserializer,
  relationshipsFix,
  QuoteSerializer
};
