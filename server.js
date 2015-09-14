var express = require('express');
var app = express();
var passport = require('passport');
var UserManager = require('./src/managers/user');
var userManager = new UserManager();
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;
app.use('/api/', require('./src/controllers'));

var options = {
  clientID: process.env.FACEBOOK_APP_ID, 
  clientSecret: process.env.FACEBOOK_APP_SECRET 
}

// Set up a local strategy session.
// TODO: Memcache for multiple users
passport.use(new FacebookTokenStrategy({
    clientID: options.clientID,
    clientSecret: options.clientSecret
  },

  function(accessToken, refreshToken, profile, done) {
    console.log('AUTH USER');
    userManager.reqUser(accessToken)
      .then(function(user){
        done(null, user.body);
      })
      .catch(function(err){
        done(err, null);
      })
  }

));

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});