// home.js - top level routes that don't have dynamic parts

module.exports = {

   // app.get('/'...)
   index: function(req, res) {
      res.render('index.jade', {
         title: 'GrassTweets.com'
         , user: req.user
      });
   },

   // app.get('/loginError'...)
   loginError: function(req, res) {
      res.render('template.jade', {
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