const ENV = require('../app/config/app');
const { TaskDeserializer } = require('../app/adapters/json-api');
function errors(err) {
  if (err) {
    console.log(err)
  } else {
    console.log('working')
  }
}

/**
 * Function for adding meta data to JSON-api
 * @param {Object} data
 * @param {Object} meta
 * @return {Object}
 */
function addMeta (data, meta) {
  return Object.assign(data, meta);
}


function ErrorMessage(err) {
  console.log(err);
}

function setUrl(obj, key) {
  if (typeof obj.toObject === 'function') {
    obj = obj.toObject();
  }
  obj[key] = ENV.host + '/public/icons/' + obj[key];
  return obj;
}

let CommonManager = {
  getPostData: function (req, res) {
    //Convert api to promise based api
    return new Promise((resolve, reject) => {
      // Check if this is a form post or a stream post via REST client.
      if (req.readable) {
        // REST post.
        var content = '';
        req.on('data', function (data) {
          if (content.length > 1e6) {
            // Flood attack or faulty client, nuke request.
            res.json({ error: 'Request entity too large.' }, 413);
          }
          // Append data.
          content += data;
        });
        req.on('end', function () {
          // Return the posted data in JSON format.
          resolve(JSON.parse(content));
        });
      } else {
        resolve(req.body);
      }
    })
  }
}

/**
 * Method for firinig callback1 if data exsists and firing call2
 * if data dosen't exist.
 * @param Object<MongoDB collection> collection
 * @param Object query
 * @param Function
 * @param Function
 * @return null
 */
function match(collection, query, call1, call2) {
  if (collection && typeof collection.findOne === 'function') {
    collection.findOne(query).then(data => {
      if (data) {
        call1(data);
      } else {
        call2('No data');
      }
    }).catch(ErrorMessage)
  }
}

module.exports = {
  errors,
  setUrl,
  CommonManager,
  addMeta,
  match,
  ErrorMessage
}
