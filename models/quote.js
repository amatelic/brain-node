var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let Quote =  Schema({
  author : String,
  message : String,
});

Quote.statics.random = function() {
  let self = this;
  return new Promise((resolve, reject) => {
    self.count(function(err, count) {
      if (err) {
        return reject(err);
      }
      var rand = Math.floor(Math.random() * count);
      self.findOne({}).skip(rand).exec((err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  });
};

mongoose.model("Quote", Quote);
