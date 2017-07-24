var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
    title:      String,
    appId:      String
});

module.exports = mongoose.model("game", gameSchema);