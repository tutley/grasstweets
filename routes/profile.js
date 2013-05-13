// profile.js - routes for user profile displays, etc
var User = require('../models/user');
var Tweet = require('../models/tweet');

// TODO: delete this, no longer needed
var states = require('../states');

module.exports = {

   // app.get('/profile', restrict, profile.mine);
   mine: function(req, res, next) {
      Tweet.find({'user': req.user._id}, function(err, tweets){
         if (err) { next(err);}
         res.render('myProfile.jade', {
            title: 'Your GrassTweets Profile',
            user: req.user,
            tweets: tweets
         });
      });
   },

   // app.get('/profile/state')
   // map link http://i.imgur.com/iVVUOwz.png
   state: function (req, res, next) {
      var message = null;
      if (req.session.message) {
         message = req.session.message;
         delete req.session.message;
      } 
      res.render('state.jade', {
         title: 'GrassTweets: Select your State',
         user: req.user,
         message: message,
         states: states
      });
   },

   // app.post('/profile/state')
   changeState: function (req, res, next) {
      User.findById(req.user._id, function(err, user) {
         if (err) { next(err); }
         user.state = req.body["state"];
         user.save(function(err) {
            if (err) {
               req.session.message = 'Something went terribly wrong. Please Try again <BR><BR>' + err.message;
               res.redirect('/profile/state');
            } else {
               res.redirect('/profile');
            }
         });
      });
   },

   // app.get('/profile/:uname', profile.display); // query based on twitter username
   display: function(req, res, next) {
      User.findOne({ 'username' : req.params.uname })
      .populate('tweets')
      .exec(function(err, profile) {
         if (err) { next(err); }
         res.render('profile.jade', {
            title: 'GrassTweets: @' + profile.username,
            user: req.user,
            profile: profile
         });
      });
   }

}