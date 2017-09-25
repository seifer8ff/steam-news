const express = require('express');
const router = express.Router();
const News = require('../models/news');
const steam = require('../steamInterface');
const Promise = require('bluebird');


//  GET news for all appIds in query string 
router.get('', (req, res) => {
  // get and process query params
  var appIds = [];
  typeof req.query.id === 'string' ? appIds.push(req.query.id) : appIds = req.query.id;

  var refreshAppIds = [];
  typeof req.query.refreshId === 'string' ? refreshAppIds.push(req.query.refreshId) : refreshAppIds = req.query.refreshId;

  let limit = Number(req.query.limit) || 1;

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
      .sort({ date: 'descending' })
      .limit(limit)
      .catch(err => console.log("error fetching news from DB for " + appId))
      // add news returned from DB to final newsArray obj
      .then(news => newsObj[appId] = news);
  })
  .then(() => {
    return res.status(200).json(newsObj);
  })
});






module.exports = router;