// home.js - top level routes that don't have dynamic parts

module.exports = {

   // app.get('/'...)
   index: function(req, res) {
      res.render('index.jade', {
         title: 'GrassTweets.com'
         , user: req.user
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

}