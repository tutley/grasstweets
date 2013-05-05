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
            res.json(500, err);
            res.end();
            next(err);
         }
         res.json(200, reps);
         res.end();
      });
   },

   //app.get('/reps/:uname', reps.one); //- uname being the twitter username of a representative
   one: function(req, res, next) {
      Rep.findOne({ 'twitterName' : req.params.uname })
         .populate('incoming')
         .exec(function(err, rep) {
            res.render('repProfile.jade', {
               title: rep.name + ' - Grastweets.com',
               user: req.user,
               rep: rep
            });
      });
   },

}