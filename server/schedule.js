const scheduler = require('node-schedule');
const GameTrack = require('./models/game-track');
const News = require('./models/news');
const axios = require('axios');

var schedule = {};

schedule.rule = new scheduler.RecurrenceRule();
schedule.rule.minute = 59;
schedule.newsURL = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=';
 
schedule.saveLatestNewsJob = scheduler.scheduleJob(schedule.rule, getLatestNews);

function getLatestNews() {
    console.log("fetching latest news from steam");
    
    GameTrack.find()
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
    return {
        title: rawNewsItem.title,
        body: rawNewsItem.contents,
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
}

schedule.setUpDummyData = function() {
    console.log("adding dummy games to db");
    var game1 = {
        appId: '440'
    }
    var game2 = {
        appId: '361420'
    }
    GameTrack.create(game1);
    GameTrack.create(game2);
}

module.exports = schedule;