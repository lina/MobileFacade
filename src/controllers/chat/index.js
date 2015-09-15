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

console.log('inside chat controller index.js')

router.post('/getUserChats', passport.authenticate('facebook-token', {session: false }), function(req, res) {
  console.log('inside /getUserChats, index.js chat controllers MobileFacade, req.query.userId:', req.query.userId);
  console.log('inside /getUserChats, index.js chat controllers MobileFacade, req.query', req.query);
  console.log('inside /getUserChats, index.js chat controllers MobileFacade, req.user', req.user);
  console.log('inside /getUserChats, index.js chat controllers MobileFacade, req.user.fbId', req.user.fbId);


  console.log('inside /getUserChats, index.js chat controllers MobileFacade, req.query', JSON.stringify(req.query));


  chatManager.getUserChats(req.user.fbId)
  .then(function(body) {
    console.log('body',body);
    res.send(body);
    // res.sendStatus(201);
  });
});

module.exports = router;
