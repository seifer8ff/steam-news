var passport      = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    auth          = require("./auth"),
    User          = require("../models/user");


module.exports = function() {

//=====================
// PASSPORT SETUP
//=====================

  // passport.serializeUser(function(user, done) {
  //   console.log('reached serialize');
  //   var query = {'username':req.user.username};
  //   req.newData.username = req.user.username;
  //   User.findOneAndUpdate(req.user.username, req.user, {upsert:true}, function(err, doc){
  //       if (err) {
  //         return next(err);
  //       }
  //       // we store the updated information in req.user again
  //       req.user = {
  //         username: user.username
  //       };
  //       next();
  //   });
  // });

  // passport.deserializeUser(function(user, done) {
  //   // placeholder for custom user deserialization.
  //   // maybe you are going to get the user from mongo by id?
  //   // null is for errors
  //   done(null, user);
  // });

  passport.use("local", new LocalStrategy({ session: false }, (username, password, done) => {
    console.log('looking for user: ' + username + " " + password);
    User.findOne({ 'username' : username }, (err, user) => {
      // if there is an error, stop everything and return that
      // ie an error connecting to the database
      if (err) {
        return done(err);
      }
      // if the user is found then log them in
      if (user) {
        user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user); // user found, return that user
          }
        });
      }
      // no user
      if (!user) {
        return done(null, false);
      }
    });
  }));


  return passport;
}

