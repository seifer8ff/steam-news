// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const passport	= require("passport");
const scheduler = require('node-schedule');
const steam = require("./server/steamInterface");
const jwt = require('jsonwebtoken');
const auth = require("./server/auth/auth");

if(!process.env.MONGODB_URI) {
  var env = require('./server/env.js');
}

// Get our API routes
const api = require('./server/routes/api');

const app = express();

// initialize and configure passport
require("./server/auth/passport")(passport);
app.use(passport.initialize());




mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI);

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '4200';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

// sync game names and ids once a day
var gameRule = new scheduler.RecurrenceRule();
gameRule.dayOfWeek = [new scheduler.Range(0, 6)];
gameRule.hour = 3;
gameRule.minute = 0;

var gameJob = scheduler.scheduleJob(gameRule, steam.refreshGameNames);

// sync news from Steam every X minutes
var newsRule = new scheduler.RecurrenceRule();
newsRule.minute = 40;
var newsJob = scheduler.scheduleJob(newsRule, steam.refreshNews);

// Setup dummy data for gameList + get all game names + appIds
steam.serverSetup();


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));