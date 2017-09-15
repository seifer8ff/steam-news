const express = require('express');
const router = express.Router();
const passport	= require("passport");
const Games = require('../models/game');
const steam = require('../steamInterface');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const auth = require("../auth/auth");
const User = require("../models/user");
const expressJwt = require('express-jwt');  
const authenticate = expressJwt({secret : auth.secret});
// initialize and configure passport
require("../auth/passport")(passport);

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


// get a dummy user gamelist
router.get('/demo/gamelist/', (req, res) => {
  console.log('returning dummy gamelist');
  res.status(200).json(dummyGameList);
});


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
  let newUser = new User({ username: req.body.username, password: req.body.password });

  // User.findOne({user})
  User.findOne({ username: newUser.username }, (err, foundUser) => {
    if (err) {
      console.log('error');
      return res.status(409).send({ success : false, message : 'username taken' });
    }

    if (foundUser) {
      console.log('username taken');
      return res.status(409).send({ success : false, message : 'username taken' });
    } else {
      // save in Mongo
      newUser.save(function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('user: ' + newUser.username + " saved.");
        }
        next();
      });
    }
  });
}



module.exports = router;