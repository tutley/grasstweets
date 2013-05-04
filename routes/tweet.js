// tweet.js - this is where the user will view and send tweets

// load helpers
var Twit = require('twit');
var config = require('../config.js');

// load relevant models
var User = require('../models/user');
var Tweet = require('../models/tweet');
var Rep = require('../models/rep');

module.exports = {

   // app.get('/tweet/testtweet'...)
   test: function(req, res) {
      User.findById( req.user._id , function(err, user) {
         if (err) { next(err); }
         var T = new Twit({
            consumer_key: config.twitter.consumerKey
            , consumer_secret: config.twitter.consumerSecret
            , access_token: user.accessToken
            , access_token_secret: user.accessTokenSecret
         });
         T.post('statuses/update', 
            { status: 'Hey just trying out the tweet functionality on grasstweets.com!' }, 
            function(err, reply) {
               if (err) { next(err); }
               res.redirect('/');
         });
      });
   },

}