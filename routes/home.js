// home.js - top level routes that don't have dynamic parts

var Tweet = require('../models/tweet');

module.exports = {

   // app.get('/'...)
   index: function(req, res) {
      Tweet.find({}, null, 
         {
            skip : 0,
            limit : 10,
            sort : {
               created : 1
            }
         })
         .populate('user')
         .exec(function(err, tweets){
         if (err) { next(err);}
         res.render('index.jade', {
            title: 'GrassTweets.com'
            , user: req.user
            , tweets: tweets
         });  
      });
   },

   // app.get('/login'...)
   login: function(req, res) {
      res.render('login.jade', {
         title: 'Login to GrassTweets.com'
         , user: req.user
      });
   },

   // app.get('/loginError'...)
   loginError: function(req, res) {
      res.render('loginError.jade', {
         title: 'GrassTweets.com Login Error'
         , user: req.user
      });
   },

   // app.get('/about'...)
   about: function(req, res) {
      res.render('about.jade', {
         title: 'About GrassTweets.com'
         , user: req.user
      });
   },

   // app.get('/about/tos'...)
   tos: function(req, res) {
      res.render('tos.jade', {
         title: 'GrassTweets.com Terms of Service'
         , user: req.user
      });
   },

}