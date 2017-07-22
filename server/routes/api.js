const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';
const newsURL = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=';

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/news/:id', (req, res) => {
  axios.get(newsURL + req.params.id + '&count=3')
    .then(news => {
      res.status(200).json(news.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

module.exports = router;