if(!process.env.MONGODB_URI) {
  var env = require('../env.js');
}

var auth = {};

auth.secret = process.env.SECRET;


// export config for inclusion in server.js
module.exports = auth;