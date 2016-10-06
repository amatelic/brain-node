const express = require('express');
const {Message} = require('../../db/db');
const {setUrl} = require('../../helpers/helpers');
const { MessageSerializer } = require('../../app/adapters/json-api');
var router = express.Router();


router.get('/messages', function (req, res) {
  let userId = req.get('Api-key');
  Message.find({_userId: userId}).then(d => {
    console.log(d);
    res.json(MessageSerializer.serialize(d));
  }).catch(err => console.log(err));
});

router.get('/messages/:id', function (req, res) {
  let id = req.params.id;
  console.log(req.body)
  console.log(req.get('Api-key'))
  console.log(req.header('Api-key'))
  res.json({1:1});
  // Message.find({_id: id}).then(d => {
  //   res.json(MessageSerializer.serialize(setUrl(d[0], 'image')));
  // }).catch(err => {data: []});
});

module.exports = router;
