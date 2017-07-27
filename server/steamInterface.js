const TrackedGames = require('./models/tracked-game');
const News = require('./models/news');
const Games = require('./models/game');
const axios = require('axios');
const Promise = require('bluebird');
var bbcode = require('bbcode.js');

var steam = {};

steam.baseURL = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=';
steam.gameNameURL = 'http://api.steampowered.com/ISteamApps/GetAppList/v0002/'

steam.getNews = function getNews(refreshIds) {
    console.log('getting news for refresh appIds');
    return new Promise(function (resolve, reject) {
        var appIds = [];
        typeof refreshIds === 'string' ? appIds.push(refreshIds) : appIds = refreshIds;
        console.log(appIds);
        

        Promise.resolve(axios.get(steam.baseURL + appIds[0] + '&count=30'))
        .then(response => response.data.appnews.newsitems)
        .then(rawNews => rawNews.map(processNewsResponse))
        .each(news => addNewsItemToDB(news))
        .then(processedNews => resolve(processedNews))
        .catch(error => {
            console.log("error getting news for " + appIds[0]);
            console.log(error);
        });
    });
}

steam.serverSetup = function() {
    addBaseGames();

    // if we haven't gotten game names and ids from steam yet, do it on server start
    Games.count({}, (err, count) => {
        if (count < 1) {
            refreshGameNames();
        }
    });
}

steam.refreshNews = function() {
    console.log("fetching latest news from steam");
    
    TrackedGames.find()
    .catch(err => console.log(err))
    .then(games => {
        games.forEach(game => {
            console.log("getting news for " + game.appId);
            axios.get(steam.baseURL + game.appId + '&count=30')
            .then(response => response.data.appnews.newsitems)
            .then(rawNews => rawNews.map(processNewsResponse))
            .then(news => news.map(addNewsItemToDB))
            .catch(error => {
                console.log("error");
            });
        });
    })  
}

function refreshGameNames() {
    axios.get(steam.gameNameURL)
        // .then(response => console.log(response.data))
        .then(response => response.data.applist.apps)
        .then(games => games.map(processGameResponse))
        .then((processedGames) => bulkAddGamesToDB(processedGames))
        .catch(error => {
            console.log("error");
        });
        return;
}

function processNewsResponse(rawNewsItem) {
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

function processGameResponse(rawGame) {
    return {
        title: rawGame.name,
        appId: rawGame.appid
    }
}

function bulkAddGamesToDB(games) {
    console.log('bulk adding games returned from Steam to db');
    Games.remove({}, err => console.log(err))
    .then(() => {
        Games.insertMany(games)
        .then(console.log('successfully replaced all games in db'))
    });
}

function addNewsItemToDB(newsItem) {
    return new Promise(function (resolve, reject) {
        var query = { articleId: newsItem.articleId };
        News.findOneAndUpdate(query, newsItem, {upsert:true}, (err, doc) => {
            if (err) console.log(err);
            return resolve(newsItem);
        });
    });
}



function addBaseGames() {
    console.log("adding dummy games to db");
    var game1 = {
        appId: '440',
        title: 'Team Fortress 2'
    }
    var game2 = {
        appId: '361420',
        title: 'Astroneer'
    }
    TrackedGames.findOneAndUpdate(game1, game1, {upsert:true}, (err, doc) => {});
    TrackedGames.findOneAndUpdate(game2, game2, {upsert:true}, (err, doc) => {});
}


module.exports = steam;