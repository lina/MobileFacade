var Promise = require("bluebird");
var request = require('request');

function UserManager(){
  // this.url = process.env.USER_SERVICES || 'http://localhost:3002';
  this.url = 'http://localhost:3002';

};

UserManager.prototype.reqUser = function(userToken) {
  console.log(userToken);

  return new Promise(function(resolve, reject){
    //this.url intergration
    request.post('http://localhost:3002' + '/api/user/', {token: userToken}, function(err, resp, body){
      if (err) {
        reject(err);
      } else if(resp.status != '200'){
        reject(new Error('status code:',resp.status));
      } else {
        resolve(body);
      }
    });
  })
};


module.exports = UserManager;