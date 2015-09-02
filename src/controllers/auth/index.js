var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;
router.use(passport.initialize());

options = {
  clientID: process.env.FACEBOOK_APP_ID || "840774716036629",
  clientSecret: process.env.FACEBOOK_APP_SECRET || "d018e4926746117d64546bed6bc4e06b"
}


passport.use(new FacebookTokenStrategy({
    clientID: options.clientID,
    clientSecret: options.clientSecret
  },
  function(accessToken, refreshToken, profile, done) {
    request.get(
      "https://graph.facebook.com/v2.4/me?access_token=" + accessToken + "&" + 
      "fields=id,name,gender,location,website,picture,relationship_status,likes,email&" + //Add extra requests here...
      "format=json", 

      function(err, resp, data) {
        console.log(err, resp, data);
        //Handle random other shit

        //use done for passport.
      }
    );
  }
));


router.use(require('body-parser').json());
router.use(require('cors')());

router.post('/facebook', passport.authenticate('facebook-token', { session: false }) ,function (req, res) {
    // do something with req.user 
  console.log(req.user);
  console.log('req recived');
  res.sendStatus(req.user ? 200 : 401);
});


router.post('/twitter', function(req,res){ 
  res.send('twitter');

});

module.exports = router;