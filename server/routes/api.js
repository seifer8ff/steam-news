const express = require('express');
const router = express.Router();
const passport	= require("passport");
const News = require('../models/news');
const Games = require('../models/game');
const steam = require('../steamInterface');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const auth = require("../auth/auth");
const User = require("../models/user");
const expressJwt = require('express-jwt');  
const authenticate = expressJwt({secret : auth.secret});

var dummyGameList = [
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



// initialize and configure passport
require("../auth/passport")(passport);


/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

// NEWS ROUTES ----------------------------------------------

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
    res.status(200).json(newsObj);
  })
});

// get all game data (appId + title)
router.get('/games', (req, res) => {
  Games.find()
  .then(games => {
    res.status(200).json(games)
  });
});



// DEMO ROUTES --------------------------

// get a dummy gamelist
router.get('/demo/gamelist/', (req, res) => {
  console.log('returning dummy gamelist');
  res.status(200).json(dummyGameList);
});



// USER ROUTES --------------------------------

// register a user
router.post('/register', registerUser, passport.authenticate('local', { session: false }), generateToken, respond);

// login a user
router.post('/login', function(req, res, next) {
  passport.authenticate('local', { session: false }, function(err, user) {
    if (!user) {
      return res.status(401).send({ success : false, message : 'authentication failed' });
    }
    req.user = user;
    next();
  })(req, res, next);
}, generateToken, respond);

// get the users current tracked game list
router.get('/:username/gamelist/', authenticate, (req, res) => {
  console.log('getting gamelist for: ' + req.params.username);
  User.findOne({username: req.params.username})
    .then(user => user.gameList)
    .then(gameList => {
      res.status(200).json(gameList);
    });
});

// delete a game from the users tracked game list
router.delete('/:username/gamelist/:appId', authenticate, (req, res) => {
  User.findOneAndUpdate(
    { username: req.params.username },
    { "$pull": { "gameList": { "appId": req.params.appId } }},
    { "new": true },
    (err, user) => {
      return res.status(200).json(user);
    }
  );
});

// add a game to the users tracked game list
router.post('/:username/gamelist', authenticate, (req, res) => {
  console.log('adding ' + req.body.title + ' to game track list');
  if (req.body.appId && req.body.title) {
    var newGame = req.body;
    User.findOneAndUpdate({ username: req.params.username }, { $push: {gameList: newGame} }, (err, doc) => {
      if (err) console.log(err);
    });
  } else {
    console.log('invalid appId received');
  }
});





// MIDDLEWARE -------------------------------

function generateToken(req, res, next) {  
  req.token = jwt.sign({
    username: req.user.username
  }, auth.secret, {
    expiresIn: '1 days'
  });
  next();
}

function respond(req, res) {
  res.status(200).json({
    user: {
      username: req.user.username,
      gameList: req.user.gameList,
    },
    token: req.token
  });
}

function registerUser(req, res, next) {
  let user = new User({ username: req.body.username, password: req.body.password });
  // save in Mongo
  user.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('user: ' + user.username + " saved.");
    }
    next();
  });
}



module.exports = router;