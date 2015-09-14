var express = require('express');
var router = express.Router();
var request = require('request')
var passport = require('passport');
var ChatManager = require('../../managers/chat');
var chatManager = new ChatManager();

router.use(require('body-parser').json());
router.use(require('cors')());


router.post('/sendMessage', passport.authenticate('facebook-token', { session: false }),  function(req, res){
  console.log('req.body', req.body);
  console.log('ChatManagerManager', ChatManagerManager);

  chatManager.sendMsg();
  // checkInManager.createCheckIn(req.body.latitude, req.body.longitude, req.body.activity, req.body.userId)
  // .then(function(checkinRes){
  //   res.sendStatus(201);
  // });
})
