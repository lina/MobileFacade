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

module.exports = ChatManager;