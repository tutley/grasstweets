// reps.js - routes for user profile displays, etc

var Tweet = require('../models/tweet');
var Rep = require('../models/rep');
var Addrep = require('../models/addrep');

var states = require('../states.js');

module.exports = {
   //app.get('/reps', reps.main);
   main: function(req, res, next) {
      var state = null;
      if (req.query['state']) {
         state = req.query['state'];
      } else if (req.user) {
         state = req.user.state;
      } else {
         state = 'SC'; //nothin' finer
      }
      Rep.find({ state : state })
      .sort({'body': -1, 'name' : 1})
      .exec(function(err, reps) {
         if (err) { next(err); }
         Rep.find().distinct('state', function(err, currStates) {
            if (err) {next(err); }
            res.render('repsMain.jade', {
               title: 'Elected Officials on Twitter - GrassTweets.com',
               user: req.user,
               reps: reps,
               states: currStates,
               currState: state
            });
         });
      });
   },

   //app.get('/reps/:uname', reps.one); //- uname being the twitter username of a representative
   one: function(req, res, next) {
      Rep.findOne({ 'twitterName' : req.params.uname }, function(err, rep) {
         if (err) { next(err); }
         if (rep) {
            Tweet.find({ reps: rep._id }, function(err, tweets) {
               if (err) { next(err); }
               res.render('repProfile.jade', {
                  title: rep.name + ' - Grastweets.com',
                  user: req.user,
                  rep: rep
               });
            });
         } else {
            // no rep found with that name, display error
            res.render('repProfile.jade', {
               title: 'Rep Not Found - GrassTweets.com',
               user: req.user
            });
         }
      });
   },

   // app.get('/reps/add', reps.addForm);
   addForm: function(req, res) {
      res.render('addRep.jade', {
         user: req.user,
         title: 'Add a Rep to GrassTweets.com',
         states: states
      });
   },

   // app.post('/reps/add', reps.add);
   add: function(req, res, next) {
      var data = req.body;
      var added = new Addrep(data);
      added.addedBy = req.user._id;
      added.save(function(err) {
         if (err) { next(err); }
         res.redirect('/reps/add/view');
      });
   },

   // app.get('/reps/add/view', reps.viewAdds);
   viewAdds: function(req, res, next) {
      var state = req.user.state;
      if (req.query['state']){
         state = req.query['state'];
      }
      Addrep.find({ 'state' : state })
         .sort({ 'added': -1 })
         .populate('addedBy')
         .exec(function(err, reps){
            if(err) { next(err); }
            res.render('viewAdds.jade', {
               title: 'GrassTweets: Current Suggested Additions',
               user: req.user,
               reps: reps,
               states: states,
               currState: state
            });
         });
   },

   // app.get('/reps/fix/:rep', reps.fixForm);
   fixForm: function(req, res, next) {
      // be sure to show the current suggested fixes here as well
      Rep.findById(req.params.rep, function(err, rep){
         if (err) { next(err); }
         console.log(rep);
         res.render('fixRep.jade', {
            title: 'GrassTweets: Suggest Edits for ' + rep.twitterName,
            user: req.user,
            rep: rep
         });
      });
   },

   // app.post('/reps/fix', reps.fix);
   fix: function(req, res, next) {
      console.log(req.body);
      var data = {};
      var rep = req.body.rep;
      data['by'] = req.user._id;
      data['field'] = req.body.field;
      data['value'] = req.body.value;
      Rep.update({'_id':rep}, {$push : { 'corrections' : data }}, function(err) {
         if(err) { next(err); }
         res.redirect('/reps/fix/'+rep);
      });
   }

}