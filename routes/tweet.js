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
 * @param  {Object}   tweet    The tweet object
 * @param  {array}    reps     Array of Representatives (objects) to tweet
 */
function sendATweet(user, tweet, reps) {

   var error = null;
   var fullMessage = '';
   // Setup the Twitter API interface
   var T = new Twit({
      consumer_key: config.twitter.consumerKey
      , consumer_secret: config.twitter.consumerSecret
      , access_token: user.accessToken
      , access_token_secret: user.accessTokenSecret
   });

   var lastTweet = reps.length -1;
   // iterate through each rep, send the tweet, and add the repID
   reps.forEach(function(rep, i) {
      fullMessage = '.' + rep.twitterName + ' ' + tweet.message;     
      T.post('statuses/update', 
      { status: fullMessage, trim_user: true }, 
      function(err, reply) {
         if (err) {
            error = err;
            tweet.reps.push({ 
               'id' : rep._id,
               'tweetId' : 'ERROR'
            });
            tweet.save();
         }
         // add this tweet to the successful results
         tweet.reps.push({ 
            'id' : rep._id,
            'tweetId' : reply.id_str
         });
         tweet.save();
      });
   });
}

module.exports = {
   // app.get('/tweet')
   main: function (req, res, next) {
      if (req.user.state) {
         // TODO: Find a better way to do this
         var categories = [
            { 'name':'US House', 'short':'ushouse'}, 
            { 'name':'US Senate', 'short':'ussenate'}, 
            { 'name':'State House', 'short':'sthouse'}, 
            { 'name':'State Senate', 'short':'stsenate'}];

         var parties = [
            { 'name': 'Republican', 'short':'R'},
            { 'name': 'Democrat', 'short':'D'},
            { 'name': 'Other', 'short': 'O'}];
         Rep.find({ state: req.user.state }, function(err, reps) {
            if (err) { next(err); }
            res.render('tweetApp.jade', {
               title: 'Send a Tweet with GrassTweets',
               user: req.user,
               reps: reps,
               categories: categories,
               parties: parties
            });
         });
      } else {
         req.session.message = 'First we need to know your state of residence.';
         res.redirect('/profile/state');
      }
   },

   // app.get('/tweet/:id')
   display: function(req, res, next) {
      Tweet.findOne({'_id':req.params.id})
         .populate('reps.id user')
         .exec(function(err, tweet) {
         if (err) { next(err); }
         // TODO: take into account tweetId = ERROR
         var count = tweet.reps.length;
         res.render('tweet.jade', {
            title: 'A GrassTweet from @' + tweet.user.username,
            user: req.user,
            tweet: tweet,
            count: count
         });
      });
   },

   // app.post('/tweet'...)
   send: function(req, res, next) {
      delete req.session.tweet;
      var data = req.body;
//      console.log(data);

      // create a new tweet document and update the user doc
      var tweet = new Tweet();
      tweet.message = data.message;
      tweet.user = req.user._id;
      tweet.state = req.user.state;
      // save the tweet in the tweet collection
      tweet.save(function(err) {
         if (err) { 
            res.send(500, {'error':err.message});
            next(err); 
         }
         // update the user doc with this tweet
         User.update({ '_id' : req.user._id }, {$push: { 'tweets' : tweet._id } });

         // lookup the rep data and send the tweet
         Rep.find({'_id': { $in : data.reps }}, function(err, reps){
            if (err) {
                  res.send(500, {'error':err.message});
                  next(err);
               }
            // send the tweet(s)
            sendATweet(req.user, tweet, reps);
            res.send(200, {'tweetURL':'/tweet/'+tweet._id});
         });
      });
   },

   // app.get('/tweet/status')
   // Not sure if I'm going to use this but it could be a good progress bar tool
   status: function(req, res, next) {
      var tid = req.body.tid;
      Tweet.findById(tid, function(err, tweet) {
         if (err) {
            res.send(500, { 'error' : err.message });
            next(err);
         }
         res.send(200, { 'count' : tweet.reps.length });
      });
   }
}