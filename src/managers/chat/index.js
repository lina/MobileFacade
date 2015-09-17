var Promise = require("bluebird");
var request = require('request');

function ChatManager(){
  if(process.env.CHATSERVICES_PORT_3003_TCP_ADDR) {
      this.url = 'http://'+process.env.CHATSERVICES_PORT_3003_TCP_ADDR+':3003';
  } else {
    this.url = process.env.CHAT_SERVICES_URL || 'http://localhost:3003';
  } 
};

ChatManager.prototype.sendMsg = function() {
  console.log('inside chat manager sendMsg invoked')
};

ChatManager.prototype.getUserChats = function(userId) {
  var currentUrl = this.url;
  // console.log('userId inside chatManager', userId);
  // console.log('retrieving user chats from:',currentUrl + '/api/userChats/getAllUserChats')
  return new Promise(function(resolve, reject) {
    request.post(
      {
        url: currentUrl + '/api/userChats/getAllUserChats/',
        body: {
          userId: userId
        },
        json: true
      },
      function(err, resp, body) {
      if(err) {
        reject(err);
      } else {
        // console.log('body inside getUserChats', body);
        resolve(body);
      }
    });
  })
};

ChatManager.prototype.getChatDetails = function(chatIDs) {
  var currentUrl = this.url;
  console.log('inside chatManager.getChatDetails');
  return new Promise(function(resolve, reject) {
    request.post({
      url: currentUrl + '/api/chat/getChatDetails/', 
      body: {
        chatIDs: chatIDs
      },
      json: true
    },
    function(err, resp, body) {
      if(err) {
        reject(err);
      } else {
        console.log('body inside getChatDetails', body);
        resolve(body);
      }
    });
  })
};

module.exports = ChatManager;