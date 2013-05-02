// Module Dependencies
var express = require('express')
   , routes = require('./routes')
   , mongoose = require('mongoose')
   , mongo = require('mongodb')
   , passport = require('passport')
   , mongoStore = require('connect-mongo')(express);

var app = module.exports = express();
global.app = app;

// Connect to the database once
var DB = require('./database');
var db = new DB.startup('mongodb://localhost/grasstweets');

// Setup session store variables
var storeConf = {
   db: {
      db: 'grasstweets',
      host: 'localhost'
   },
   secret: process.env.SESSION_SECRET
};

// Import top level navigation menu
app.locals.links = require('./navigation');

// App Config
app.configure(function(){
   app.set('views', __dirname + '/views');
   app.set('view engine', 'jade');
   app.use(function(req, res, next) {
     var current = req.path.split('/');
     res.locals.current = '/' + current[1];
     next();
   });
   app.use(express.bodyParser());
   app.use(express.cookieParser());
   app.use(express.methodOverride());
   app.use(express.session({
      secret: storeConf.secret,
      maxAge: new Date(Date.now() + 3600000),
      store: new mongoStore(storeConf.db)
   }));
   app.use(passport.initialize());
   app.use(passport.session());
   app.use(app.router);
   app.use(express.static(__dirname + '/public'));
});


var db = new DB.startup(conn);

//environment specific config
app.configure('development', function(){
   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
   app.use(express.errorHandler());
});

// Load the router
require('./routes')(app);

var port = process.env.GRASS_PORT || 6000;
app.listen(port, function() {
  console.log("Listening on " + port);
});