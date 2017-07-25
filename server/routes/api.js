const express = require('express');
const router = express.Router();
const News = require('../models/news');
const GameList = require('../models/game-list');
const schedule = require('../schedule');

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
  console.log('refreshAppIds = ' + refreshAppIds);

  //set up return objects
  var newsObj = {};

  // get news for new ids
  schedule.getNews(refreshAppIds) // gets and saves to DB

  //add refreshAppIds to appIds
  .then( () => {
    appIds = refreshAppIds ? appIds.concat(refreshAppIds): appIds;
    return(appIds);
  })
  
  // get all news from db 
  .then(appIds => {
    var queryArray = [];
    console.log('AppIds= ' + appIds);

    appIds.forEach(appId => {
      // add DB query promise to array for each appId
      var newQuery = News.find({ appId: appId })
        .catch(err => console.log("error fetching news from DB for " + appId))
        // add news returned from DB to final newsArray obj
        .then(news => newsObj[appId] = news);
      queryArray.push(newQuery);
    });
    return queryArray;
  })

  // once all promises have finished, respond to front end with all news
  .then(queryArray => {
    Promise.all(queryArray)
    .then( () => {
      console.log('all promises done and returning');
      res.status(200).json(newsObj);
    })
  })
});

router.get('/games', (req, res) => {
  console.log('querying DB for gameList');

  GameList.find()
  .then(data => data.map(gameList => gameList.appId))
  .then(gameList => {
    res.status(200).json(gameList)
  });
})

router.post('/games', (req, res) => {
  console.log('trying to add appId to gameList');
  if (req.body.appId) {
    console.log('appId received: ' + req.body.appId);

    var newGame = { appId: req.body.appId }
    GameList.findOneAndUpdate(newGame, newGame, {upsert:true}, (err, doc) => {
      if (err) console.log(err);
    });
    schedule.getNews(req.body.appId);
  } else {
    console.log('invalid appId received');
  }
});

module.exports = router;