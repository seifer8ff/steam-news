var mongoose = require("mongoose");

var gameListSchema = new mongoose.Schema({
    appId:      String
});

module.exports = mongoose.model("gamelist", gameListSchema);