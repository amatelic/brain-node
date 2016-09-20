const ENV = require('../app/config/app');
const { TaskDeserializer } = require('../app/adapters/json-api');
function errors(err) {
  if (err) {
    console.log(err)
  } else {
    console.log('working')
  }
}

function setUrl(obj, key) {
  if (typeof obj.toObject === 'function') {
    obj = obj.toObject();
  }
  obj[key] = ENV.host + '/public/icons/' + obj[key];
  return obj;
}

let CommonManager = {
    getPostData: function (req, res, callback) {
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
                // Return the posted data.
                // JSON.parse(data)
                // console.log(conten)
                 TaskDeserializer.deserialize(JSON.parse(content), (err, task) => {
                   if (err) {
                     return console.error('There were some problems');
                   }
                  callback(task);
                 });
            });
        }
        else {
            // Form post.
            callback(req.body);
        }
    }
}



module.exports = {
  errors,
  setUrl,
  CommonManager
}
