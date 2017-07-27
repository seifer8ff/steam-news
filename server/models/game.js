var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
    appId:      String,
    title:      String
});

module.exports = mongoose.model("game", gameSchema);