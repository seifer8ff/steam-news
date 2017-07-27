var mongoose = require("mongoose");

var trackedGameSchema = new mongoose.Schema({
    appId:      String,
    title:      String
});

module.exports = mongoose.model("trackedGame", trackedGameSchema);