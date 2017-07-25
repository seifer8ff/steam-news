const scheduler = require('node-schedule');
const GameList = require('./models/game-list');
const News = require('./models/news');
const axios = require('axios');
var bbcode = require('bbcode.js');

var schedule = {};

schedule.rule = new scheduler.RecurrenceRule();
schedule.rule.minute = 40;
schedule.newsURL = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=';
 
schedule.saveLatestNewsJob = scheduler.scheduleJob(schedule.rule, refreshNews);

schedule.getNews = function getNews(appIds) {
    return new Promise(function (resolve, reject) {
        if (!appIds) resolve(null);

        console.log("fetching news for appId: " + appIds[0]);

        axios.get(schedule.newsURL + appIds[0] + '&count=30')
        .then(news => news.data.appnews.newsitems)
        .then(newsItems => newsItems.map(processNewsItem))
        .then((processedNewsItems) => processedNewsItems.map(addNewsItemToDB))
        .then(processedNewsItems => resolve(processedNewsItems))
        .catch(error => {
            console.log("error getting news for ");
        });
    });
}

function refreshNews() {
    console.log("fetching latest news from steam");
    
    GameList.find()
    .catch(err => console.log(err))
    .then(games => {
        games.forEach((game) => {
            console.log("getting news for " + game.appId);
            axios.get(schedule.newsURL + game.appId + '&count=30')
            .then(news => news.data.appnews.newsitems)
            .then(newsItems => newsItems.map(processNewsItem))
            .then((processedNewsItems) => processedNewsItems.map(addNewsItemToDB))
            .catch(error => {
                console.log("error");
            });
        });
    })  
}

function processNewsItem(rawNewsItem) {
    // console.log('processing News items');
    // convert bbcode to html before saving to DB
    let processedBody = bbcode.render(rawNewsItem.contents);

    return {
        title: rawNewsItem.title,
        body: processedBody,
        url: rawNewsItem.url,
        date: rawNewsItem.date,
        appId: rawNewsItem.appid,
        articleId: rawNewsItem.gid
    }
}

function addNewsItemToDB(newsItem) {
    var query = { articleId: newsItem.articleId };
    News.findOneAndUpdate(query, newsItem, {upsert:true}, (err, doc) => {
        if (err) console.log(err);
        // console.log('saved');
    });
    return newsItem;
}

schedule.setUpDummyData = function() {
    console.log("adding dummy games to db");
    var game1 = {
        appId: '440'
    }
    var game2 = {
        appId: '361420'
    }
    GameList.create(game1);
    GameList.create(game2);
}

module.exports = schedule;