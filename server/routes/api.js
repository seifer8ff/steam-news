const express = require('express');
const router = express.Router();
const News = require('../models/news');
const TrackedGames = require('../models/tracked-game');
const steam = require('../steamInterface');
const Promise = require('bluebird');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

//  GET news for all appIds in query string 
router.get('/news', (req, res) => {
  // get and process query params
  var appIds = [];
  typeof req.query.id === 'string' ? appIds.push(req.query.id) : appIds = req.query.id;

  var refreshAppIds = [];
  typeof req.query.refreshId === 'string' ? refreshAppIds.push(req.query.refreshId) : refreshAppIds = req.query.refreshId;

  //set up return objects
  var newsObj = {};

  var newsPromise = new Promise((resolve, reject) => {
    if (!refreshAppIds) {
      // if we don't need to refresh, just return appIds
      return resolve(appIds);
    }

    steam.getNews(refreshAppIds) // gets and saves to DB
    .then(() => {
      appIds = appIds.concat(refreshAppIds);
      return resolve(appIds);
    })
  })
  // get all news from db 
  .each(appId => {
    return News.find({ appId: appId })
      .catch(err => console.log("error fetching news from DB for " + appId))
      // add news returned from DB to final newsArray obj
      .then(news => newsObj[appId] = news);
  })
  .then(() => {
    console.log('all promises done and returning');
    res.status(200).json(newsObj);
  })
});

router.get('/games', (req, res) => {
  console.log('querying DB for gameList');

  TrackedGames.find()
  .then(data => data.map(games => games.appId))
  .then(appIds => {
    res.status(200).json(appIds)
  });
})

router.post('/games', (req, res) => {
  console.log('trying to add appId to gameList');
  if (req.body.appId) {
    console.log('appId received: ' + req.body.appId);

    var newGame = { appId: req.body.appId }
    TrackedGames.findOneAndUpdate(newGame, newGame, {upsert:true}, (err, doc) => {
      if (err) console.log(err);
    });
  } else {
    console.log('invalid appId received');
  }
});

module.exports = router;