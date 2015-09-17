var express = require('express');
var app = express();
var passport = require('passport');
var UserManager = require('./src/managers/user');
var userManager = new UserManager();
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var process = require('./config');

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
    console.log('clientId', options.clientID);
    console.log('clientSecret', options.clientSecret);
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

var users = users || {};

io.on('connection', function (socket) {
    console.log('socket connected');
    socket.emit('news', { hello: 'world' });

    socket.on('added new user to chat', function(
      data, 
      currentUser
      ) {
      for (var key in data) {
        if(key !== currentUser) {
          users[key].emit('chat participant updates', data, function(data) {
            console.log('emit "chat participant updates"')
          })          
        }
      }
    })

    socket.on('update other user private chat storage', function(
      receiverID, 
      chatID, 
      senderID
      ) {
      console.log("socket.on 'update other user private chat storage'");
      users[receiverID].emit('receiving changes to private chat storage', function(chatID, senderID) {
        console.log("socket emit 'receiving changes to private chat storage'");
      })
    })


    // test code
    socket.on('my other event', function (data) {
        console.log('should say world', data);
      });
    // console.log('--------------------->socket,', socket);

    socket.on('new user logged on', function(data, callback) {
      console.log('#####################################################################')
      // console.log('------------------------>data,', data);

      if (data in users){
        callback(false);
      } else {
        callback(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        // updateNicknames();
      }
      // console.log('---------------->users',users);
    });

    socket.on('send message', function(
      data, 
      participantUserIDs, 
      // currentUserId, 
      callback
      ){
      console.log('.on "send message" in MobileFacade server.js')
      // console.log('---------------------------------->data', data);

      data.message = data.message.trim();


      // var message = data.message.trim();
      // var messageTime = data.messageTime;
      var senderId = data.senderId;
      // var senderProfileImage = data.senderProfileImage;
      // var 
      console.log('senderId', senderId);
      console.log('----------------------->users', users);

      // for (var key in users) {
      //   console.log('------------------>this key exists in user', key);
      // }
      console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&participantUserIDs', participantUserIDs)

      // var id = users[name].id;
      // if (receiverUser in users){      
      // console.log('*****************users[senderId] inside server.js MobileFacade', users[senderId]);
      for (var key in participantUserIDs) {
        console.log('should be a userID',key);
        console.log('senderId', senderId);
        // if(key !== senderId  && users[key]) {
          // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ users[key]', users[key]);
          console.log('about to emit a message');
          users[key].emit('receive new message', data, function(data) {

            console.log('**************************************************.emit to ', key);
          });                    
        // }
      }
        // socket.emit('new message', {msg: msg, nick: socket.nickname});
      // } else {
      //   callback('Error! Invalid user selected.');
      // }
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



