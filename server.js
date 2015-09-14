var express = require('express');
var app = express();
var passport = require('passport');
var UserManager = require('./src/managers/user');
var userManager = new UserManager();
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

var server = http.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(server.address());
  console.log('MobileFacade listening at http://%s:%s', host, port);
});


// io.on('connection', function (socket) {
//     console.log('socket connected');

//     socket.on('user login', function(data) {
//       console.log('socket.on user login')
//       console.log('data in userlogin', data)
//     })

//     socket.on('disconnect', function () {
//         console.log('socket disconnected');
//     });

//     socket.emit('text', 'wow. such event. very real time.');
// });

io.on('connection', function (socket) {
    console.log('socket connected');
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log('should say world', data);
      });

    socket.on('user login', function(data) {
      console.log('socket.on user login')
    })

    socket.on('helloServer', function(data) {
      socket.emit('helloClient')
      console.log('client said hello to server');
    })

    socket.on('clicked on twitter', function() {
      console.log('user pressed on twitter');
      socket.emit('twitter listener');
    });

    socket.on('disconnect', function () {
      console.log('socket disconnected');
    });


    // socket.emit('text', 'wow. such event. very real time.');
});

module.exports = app;
