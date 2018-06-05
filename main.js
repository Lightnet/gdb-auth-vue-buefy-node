// server.js
// where your node app starts

// init project
var fs = require('fs');
var path = require('path');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var app = express();
var Gun = require('gun');
require('gun/lib/then');

//process.env.GUN_ENV = 'dev';
var socketIO = require('socket.io');
var helmet = require('helmet');

var Strategy = require('passport-discord').Strategy

var LevelStore = require('level-session-store')(session);

require('dotenv').config();
var PORT = process.env.PORT || 8080;

//Site API
const DISCORDAPIID = process.env.DISCORDAPIID || '';
const DISCORDAPISECERT = process.env.DISCORDAPISECERT || '';
const DISCORDAPICALLBACK = process.env.DISCORDAPICALLBACK || '';
//Bot
const DISCORDBOTTOKEN = process.env.DISCORDBOTTOKEN || '';

//var bots = [];

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(helmet());
app.use(helmet.noCache());

passport.serializeUser(function(user, done) {
  //console.log("serializeUser:",user);
  //console.log("serializeUser:");
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  //console.log("deserializeUser:",obj);
  //console.log("deserializeUser:");
  done(null, obj);
});

//var scopes = ['identify', 'email', 'guilds', 'guilds.join'];
var scopes = ['identify', 'guilds'];

passport.use(new Strategy({
  clientID: DISCORDAPIID,
  clientSecret: DISCORDAPISECERT,
  callbackURL: DISCORDAPICALLBACK,
  scope: scopes
}, function(accessToken, refreshToken, profile, done) {
  //profile.refreshToken = refreshToken; // store this for later refreshes
  //console.log(refreshToken);
  process.nextTick(function() {
    return done(null, profile);
  });
}));

//session
var sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: true,
    saveUninitialized: true,
  //maxAge: 24 * 60 * 60 * 1000, // 24 hours
  store: new LevelStore()
});

//session
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

//index page
app.get('/', checkAuth, function(req, res) {
  //console.log(res);
  //console.log("req.session.user");
  //console.log(req.session.passport.user.username);
  //console.log(req.session.passport.user);
  res.render('index',{user:req.session.passport.user});
});

//login url
app.get('/login', passport.authenticate('discord', { scope: scopes }), function(req, res) {});
//authenticate access
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
      function(req, res) { 
        res.redirect('/');
        //res.redirect('/info')
        //res.sendFile(path.join(__dirname + '/index.html'));
      } // auth success
);
//logout url
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
// user data
app.get('/info', checkAuth, function(req, res) {
    //console.log(req.user)
    res.json(req.user);
});
//check authenticate 
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  //console.log("req.session.passport");
  //console.log(req.session.passport);
  //res.send('not logged in :(');
  res.render('basics',{user:"Guest"});
}

//https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
    //deal with img-src access and other for dev builds.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(Gun.serve);
app.use(bodyParser.urlencoded({ extended: true }));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
//app.use(express.static('public'));

// init sqlite db

//var dbFile = './.data/sqlite.db';
//var dbFile = process.env.DatabaseFile;// './.data/data.json';
//console.log("database path:", process.env.DatabaseFile);
//var exists = fs.existsSync(dbFile);
// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
//if(!exists){
  //console.log("file not exist!");
//}else{
  //console.log("file exist!");
//}

//https://cdn.glitch.com/94ca57e3-7116-4770-8a69-e0034c332f65%2Felement-icons.ttf?1525640363315
//https://cdn.glitch.com/94ca57e3-7116-4770-8a69-e0034c332f65%2Felement-icons.woff?1525640368138
//assets redirect
app.get("/fonts/element-icons.woff", function (request, response) {
  response.redirect("https://cdn.glitch.com/94ca57e3-7116-4770-8a69-e0034c332f65%2Felement-icons.woff?1525640368138");
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  response.render('index');
});

// listen for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  //http://localhost:3000/
  //console.log(listener.address());
});
//===============================================
// Gun.js
//===============================================
process.env.GUN_ENV='false';
var gunconfig = {
  //file: dbFile,
  //GUN_ENV:0,
  web:listener//server express
}
//process.env.GUN_ENV='dev';
console.log('process.env.GUN_ENV:',process.env.GUN_ENV);

var gun = Gun(gunconfig);

gun.on('hi', peer => {
	console.log('connect peer to',peer);
});
gun.on('bye', function(peer){// peer disconnect.
	console.log('disconnected from', peer);
});
//===============================================
// Socket.io
//===============================================
const io = socketIO(listener);
io.use(function(socket, next){
  // Wrap the express middleware
  sessionMiddleware(socket.request, {}, next);
});
//socket.io connect event
io.on('connection', function(socket){
  //check if pastport exist
  //console.log("bots:",bots.length);
  let passport = socket.request.session.passport;
  if(passport){
    if(!passport.user){
      console.log("No User ID ");  
      return;
    }
    var userId = socket.request.session.passport.user.username;
    console.log("Your User ID is", userId);
  }else{
    console.log("No User ID ");
  }

  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

//===============================================
// Init discord js
//===============================================
const Discord = require('discord.js');
//var CommandSet = require('discord-routes').CommandSet;
import dBotFramework from './src/server/DBFramework';
//function addbot(token){
  //init client bot
  //const client = new Discord.Client();
  //require('./src/server/DSJSBot')(client);
  //let bot = new dBotFramework({client:client,io:io,gun:gun});
  //client.on('ready', () => {
    //console.log(`Logged in as ${client.user.tag}!`);
  //});
  //client.on('message', msg => {
    //if (msg.content === 'ping') {
      //msg.reply('Pong!');
    //}
  //});
  //login as bot
  //client.login(token);
  //return client;
//}

//let client = addbot(DISCORDBOTTOKEN);
//bots.push(client);

//GUN_ENV='debug'
//GUN_ENV=1

const client = new Discord.Client();
let bot = new dBotFramework({client:client,io:io,gun:gun});
//init client bot
client.login(DISCORDBOTTOKEN);
