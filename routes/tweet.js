// tweet.js - this is where the user will view and send tweets

// load helpers
var Twit = require('twit');
var config = require('../config.js');

// load relevant models
var User = require('../models/user');
var Tweet = require('../models/tweet');
var Rep = require('../models/rep');


/**
 * This function will do the heavy lifting of sending the tweets, and capturing
 * some information about the tweets as they are sent
 * 
 * function sendATweet(user, message, reps, callback) {
 * @param  {object}   user     The user who is sending the tweets
 * @param  {String}   message  The tweet message
 * @param  {array}    reps     Array of Representatives (objects) to tweet
 * @param  {Function} callback 
 */
function sendATweet(user, message, reps, callback) {
   var results = [];
   var error = null;
   // Setup the Twitter API interface
   var T = new Twit({
      consumer_key: config.twitter.consumerKey
      , consumer_secret: config.twitter.consumerSecret
      , access_token: req.user.accessToken
      , access_token_secret: req.user.accessTokenSecret
   });
   // iterate through each rep, send the tweet, and add the repID
   reps.forEach(function(rep) {
      /*
      T.post('statuses/update', 
         { status: message }, 
         function(err, reply) {
            if (err) {
               error = err; 
               next(err); 
            }
            // do something with the reply object
            results.push({
               'id' : rep._id,
               'tweetId' : reply.id
            });
      });
      */
     // take this out when it goes live
      results.push({
         'id' : rep._id,
         'tweetId' : 'Just Testing'
      })
   });

   callback(error, results);
}

module.exports = {
   // app.get('/tweet')
   main: function (req, res, next) {
      if (req.user.state) {
         Rep.find({ state: req.user.state }, function(err, reps) {
            if (err) { next(err); }
            res.render('tweetApp.jade', {
               title: 'Send a Tweet with GrassTweets',
               user: req.user,
               reps: reps
            });
         });
      } else {
         req.session.message = 'First we need to know your state of residence';
         res.redirect('/profile/state');
      }
   },

   // app.get('/tweet/:id')
   display: function(req, res, next) {
      Tweet.findOne({'_id':req.params.id})
         .populate('user')
         .exec(function(err, tweet) {
         if (err) { next(err); }
         res.render('tweet.jade', {
            title: 'A GrassTweet from ' + tweet.user.username,
            user: req.user,
            tweet: tweet
         });
      });
   },

   // app.post('/tweet'...)
   send: function(req, res, next) {
      var data = JSON.parse(req.body.data);
      console.log('Post Data');
      console.log(data);

      // send the tweet(s)
      sendATweet(req.user, data.message, data.reps, function(err, results) {
         var tweet = new Tweet();
         tweet.message = message;
         tweet.user = req.user._id;
         tweet.reps = results;
         tweet.state = req.user.state;
         // save the tweet in the tweet collection
         tweet.save(function(err) {
            if (err) { next(err); }
            // update the user doc with this tweet
            User.update({ '_id' : req.user._id }, {$push: { 'tweets' : tweet._id } }, function(err){
               if (err) { next(err); }
               res.redirect('/tweet/' + tweet._id);
            });
         });
      });

   },

}