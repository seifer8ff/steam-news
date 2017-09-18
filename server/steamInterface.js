const News = require('./models/news');
const Games = require('./models/game');
const User = require('./models/user');
const axios = require('axios');
const Promise = require('bluebird');
var bbcode = require('bbcode.js');

var steam = {};

steam.baseURL = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=';
steam.gameNameURL = 'http://api.steampowered.com/ISteamApps/GetAppList/v0002/';



// ----- NEWS -----

steam.getNews = function getNews(refreshIds) {
    return new Promise(function (resolve, reject) {
        var appIds = [];
        typeof refreshIds === 'string' ? appIds.push(refreshIds) : appIds = refreshIds;

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

steam.refreshNews = function() {
    User.find({}, 'gameList.appId')
    .catch(err => console.log(err))
    .then(users => {
        var allGames = [];
        users.forEach(user => {
            allGames = allGames.concat(user.gameList);
        });
        return allGames;
    })
    .then(games => {
        var appIds = new Set()
        games.forEach(game => {
            appIds.add(game.appId);
        })
        return appIds;
    })
    .map(appId => {
        axios.get(steam.baseURL + appId + '&count=30')
        .then(response => response.data.appnews.newsitems)
        .then(rawNews => rawNews.map(processNewsResponse))
        .then(news => news.map(addNewsItemToDB))
        .catch(error => {
            console.log("error");
            console.log(error);
        });
    })
}

function processNewsResponse(rawNewsItem) {
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
    return new Promise(function (resolve, reject) {
        var query = { articleId: newsItem.articleId };
        News.findOneAndUpdate(query, newsItem, {upsert:true}, (err, doc) => {
            if (err) {
                console.log(err);
            }
            return resolve(newsItem);
        });
    });
}



// ----- GAME DATA -----

steam.refreshGameNames = function() {
    axios.get(steam.gameNameURL)
        // .then(response => console.log(response.data))
        .then(response => response.data.applist.apps)
        .then(games => games.map(processGameResponse))
        .then((processedGames) => bulkAddGamesToDB(processedGames))
        .catch(error => {
            console.log("error");
            console.log(error);
        });
        return;
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





// ----- SERVER SETUP -----

steam.serverSetup = function() {
    setupDefaultUser();

    News.count({}, (err, count) => {
        if (count < 1) {
            steam.refreshNews();
        }
    })

    // if we haven't gotten game names and ids from steam yet, do it on server start
    Games.count({}, (err, count) => {
        if (count < 1) {
            steam.refreshGameNames();
        }
    });
}

function setupDefaultUser() {
    let defaultGames = [
        {
            appId: '440',
            title: 'Team Fortress 2'
        },
        {
            appId: '582660',
            title: 'Black Desert Online'
        },
        {
            appId: '252950',
            title: 'Rocket League'
        },
        {
            appId: '211820',
            title: 'Starbound'
        }
    ];
    let user = new User({ username: 'demo', password: 'passwordSteamNews', gameList: defaultGames });

    User.findOneAndUpdate(user.username, user, {upsert:true}, (err, doc) => {});
}




module.exports = steam;