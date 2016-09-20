const fs = require('fs');
const request = require('request');
const url = require("url");
//Function for loading data from web or server
function loadFile(path) {
  var result = url.parse(path);
  return new Promise(function(resolve, reject) {
    if (result.hostname) {
      request(path, function (error, response, body) {
        if (!error && response.statusCode == 200) {
         resolve(body);
        }
       reject(error)
      });
    } else {
      fs.readFile(path, 'utf8', function(error, body) {
        if (error) reject(error);
        resolve(body);
      })
    }
  });
}

module.exports = {
  load: loadFile,
}
