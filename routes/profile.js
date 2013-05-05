// profile.js - routes for user profile displays, etc
var User = require('../models/user');

module.exports = {

   // app.get('/profile', restrict, profile.mine);
   mine: function(req, res, next) {
      res.render('myProfile.jade', {
         title: 'Your GrassTweets Profile',
         user: req.user
      })
   },

   // app.get('/profile/state')
   state: function (req, res, next) {
      var message = null;
      if (req.session.message) {
         message = req.session.message;
         delete req.session.message;
      } 
      res.render('state.jade', {
         title: 'GrassTweets: Select your State',
         user: req.user,
         message: message
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
               res.redirect('/tweet');
            }
         });
      });
   },

   // app.get('/profile/:uname', profile.display); // query based on twitter username
   display: function(req, res, next) {
      User.findOne({ 'username' : req.params.uname }, function(err, profile) {
         if (err) { next(err); }
         res.render('profile.jade', {
            title: 'GrassTweets: @' + profile.username,
            user: req.user,
            profile: profile
         });
      });
   }

}