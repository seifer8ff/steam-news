var mongoose = require("mongoose");

var newsSchema = new mongoose.Schema({
	title: 		String,
	body: 		String,
	url: 		String,
    date: 	    String,
    appId:      String,
    articleId:  String
});

module.exports = mongoose.model("news", newsSchema);