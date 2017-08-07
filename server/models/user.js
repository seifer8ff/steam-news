var mongoose = require("mongoose");
const bcrypt = require('bcrypt');

var gameSchema = new mongoose.Schema({
    appId: String,
    title: String
});


var userSchema = new mongoose.Schema({
    username: String,
    password: String,
	gameList: [gameSchema]
});

userSchema.pre("save", function(next) {
  if (this.gameList.length === 0) {
    this.gameList.push({
        appId: "440",
        title: "Team Fortress 2"
    });
  }

  if (!this.isModified('password')) {
      next();
  }
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
  }
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



module.exports = mongoose.model("user", userSchema);