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
const validator = require('validator');
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
      return res.status(401).send({ success : false, message : 'Authentication Failed' });
    }
    req.user = user;
    next();
  })(req, res, next);
}, generateToken, respond);


// get a dummy user gamelist
router.get('/demo/gamelist/', (req, res) => {
  return res.status(200).json(dummyGameList);
});


// get the users current tracked game list
router.get('/:username/gamelist/', authenticate, (req, res) => {
  User.findOne({username: req.params.username})
    .then(user => user.gameList)
    .then(gameList => {
      return res.status(200).json(gameList);
    });
});


// delete a game from the users tracked game list
router.delete('/:username/gamelist/:appId', authenticate, (req, res) => {
  // validate input
  if (!req.params.appId ||
    !validator.isAlphanumeric(req.params.appId) ||
    validator.isEmpty(req.params.appId) || 
    !validator.isLength(req.params.appId, { min:1, max: 20 })) {
      return res.status(409).send({ success : false, message : 'Invalid Game Name' });
  }

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
  // validate input
  if (!req.body.appId ||
    !validator.isAlphanumeric(req.body.appId) ||
    validator.isEmpty(req.body.appId) || 
    !validator.isLength(req.body.appId, { min:1, max: 20 }) ||
    !req.body.title ||
    validator.isEmpty(req.body.title) || 
    !validator.isLength(req.body.title, { min:1, max: 100 })) {
      return res.status(409).send({ success : false, message : 'Invalid Game Name' });
  }

  var newGame = req.body;
  newGame.appId = validator.trim(newGame.appId);

  User.findOneAndUpdate({ username: req.params.username }, { $addToSet: {gameList: newGame} }, (err) => {
    if (err) {
      console.log(err);
      return res.status(409).send({ success : false, message : 'Error Adding ' + newGame.title + ' to ' + req.params.username + "'s Gamelist" });
    }
    return res.sendStatus(200);
  });
});





// MIDDLEWARE -------------------------------

function generateToken(req, res, next) {  
  req.token = jwt.sign({
    username: req.user.username
  }, auth.secret, {
    expiresIn: '60 days'
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
  // validate input
  if (!req.body.username ||
      !validator.isAlphanumeric(req.body.username) ||
      validator.isEmpty(req.body.username) || 
      !validator.isLength(req.body.username, { min:4, max: 20 }) ||
      !req.body.password ||
      !validator.isAlphanumeric(req.body.password) ||
      validator.isEmpty(req.body.password) || 
      !validator.isLength(req.body.password, { min:6, max: 20 })) {
        return res.status(422).send({ success : false, message : 'Invalid Username or Password' });
  }

  // strip white space from username and password
  let newUser = new User({ username: req.body.username, password: req.body.password });
  newUser.username = validator.trim(newUser.username);
  newUser.password = validator.trim(newUser.password);

  // User.findOne({user})
  User.findOne({ username: newUser.username }, (err, foundUser) => {
    if (err) {
      console.log('error');
      return res.status(409).send({ success : false, message : 'Username Already Taken' });
    }

    if (foundUser) {
      return res.status(409).send({ success : false, message : 'Username Already Taken' });
    } else {
      // save in Mongo
      newUser.save(function(err) {
        if(err) {
          console.log(err);
        }
        next();
      });
    }
  });
}



module.exports = router;