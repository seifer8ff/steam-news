const express = require('express');
const router = express.Router();
const News = require('../models/news');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

//  GET news for all appIds in query string 
router.get('/news', (req, res) => {
  var appIds = req.query.id;
  console.log('querying DB for news using: ');
  console.log(appIds);

  var newsObj = {};
  var queryArray = [];

  appIds.forEach(appId => {
    // add DB query promise to array for each appId
    queryArray.push(
      News.find({ appId: appId })
      // add news returned from DB to final newsArray obj
      .then(news => newsObj[appId] = news)
    );
  });

  // once all promises have finished, respond to front end with all news
  Promise.all(queryArray)
  .then(() => {
    res.status(200).json(newsObj);
  })
});

module.exports = router;