const express = require('express');
const router = express.Router();
const Games = require('../models/game');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const auth = require("../auth/auth");
const expressJwt = require('express-jwt');  
const authenticate = expressJwt({secret : auth.secret});


// get all matching game data (appId + title)
// query based on game title
router.get('', authenticate, (req, res) => {
  if (req.query.q) {
    let query = req.query.q;
    let regex = new RegExp("^" + query, "i");

    console.log('filtering gameList');
    console.log(query);

    return Games.find({ title: regex })
      .then(games => {
        return games.filter((game) => {
          return !game.title.toLowerCase().includes('server') && 
            !game.title.toLowerCase().includes('soundtrack') &&
            !game.title.toLowerCase().includes('unstable') &&
            !game.title.toLowerCase().includes('soundtrack') &&
            !game.title.toLowerCase().includes('trailer') &&
            !game.title.toLowerCase().includes('dlc') &&
            !game.title.toLowerCase().includes('demo') &&
            !game.title.toLowerCase().includes('bundle');
        });
      })
      .then(games => {
        console.log(games.length);
        res.status(200).json(games)
      })
  }

  return Games.find()
    .then(games => {
      console.log(games.length);
      res.status(200).json(games)
    });
});



module.exports = router;