// reps.js - routes for user profile displays, etc

var Tweet = require('../models/tweet');
var Rep = require('../models/rep');

module.exports = {
   //app.get('/reps', reps.main);
   main: function(req, res, next) {
      var state = null;
      if (req.user) {
         state = req.user.state;
      }
      Rep.find({ state : state }, function(err, reps) {
         res.render('repsMain.jade', {
            title: 'Elected Officials on Twitter - GrassTweets.com',
            user: req.user,
            reps: reps
         });
      });
   },

   //app.get('/reps/state/:state', reps.fetchState);
   fetchState: function(req, res, next) {
      Rep.find({ state : req.params.state }, function(err, reps) {
         if (err) {
            res.send(500, { 'error': err.message });
            next(err);
         }
         res.send(200, reps);
      });
   },

   //app.get('/reps/:uname', reps.one); //- uname being the twitter username of a representative
   one: function(req, res, next) {
      Rep.findOne({ 'twitterName' : req.params.uname }, function(err, rep) {
         if (err) { next(err); }
         Tweet.find({ reps: rep._id }, function(err, tweets) {
            if (err) { next(err); }
            res.render('repProfile.jade', {
               title: rep.name + ' - Grastweets.com',
               user: req.user,
               rep: rep
            });
         });
      });
   },

}