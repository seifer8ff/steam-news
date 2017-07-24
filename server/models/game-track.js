var mongoose = require("mongoose");

var gameTrackSchema = new mongoose.Schema({
    appId:      String
});

module.exports = mongoose.model("gametrack", gameTrackSchema);