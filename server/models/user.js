var mongoose = require("mongoose");

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
  next();
});

module.exports = mongoose.model("user", userSchema);