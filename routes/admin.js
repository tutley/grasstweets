// load relevant models
var User = require('../models/user');
var Tweet = require('../models/tweet');
var Rep = require('../models/rep');
var Addrep = require('../models/addrep');
var states = require('../states.js');

module.exports = {
   // app.get('/admin', isAdmin, admin.admin);
   admin: function(req, res, next) {
      res.render('admin/admin.jade', {
         title: 'Admin Main Menu',
         user: req.user
      });
   },

   // app.get('/admin/addRep', isAdmin, admin.showReps);
   showReps: function(req, res, next) {
      Addrep.find({})
      .populate('addedBy')
      .exec(function(err, reps) {
         if(err) {next(err);}
         res.render('admin/showReps.jade', {
            title: 'Admin: Show All Pending Reps',
            user: req.user,
            reps: reps
         });
      });
   },

   // app.get('/admin/addRep/:id?', isAdmin, admin.addRep);
   addRep: function(req, res, next) {
      Addrep.findOne({'_id':req.params.id}, function(err, rep){
         if (err) {next(err);}
         res.render('admin/addRep.jade', {
            title: 'Admin: Add Rep ' + rep.twitterName + '?',
            user: req.user,
            rep: rep,
            states: states
         });
      });
   },

   // app.post('/admin/addRep', isAdmin, admin.postRep);
   postRep: function(req, res, next) {
      var data = req.body;
      var newRep = new Rep(data);
      newRep.save(function(err) {
         if(err) {next(err);}
         var thisDate = Date.now();
         Addrep.update({ 'twitterName' : newRep.twitterName },
         {$set : {'status': 'confirmed', 'modded': thisDate }},
         function (err) {
            if (err) {next(err);}
            res.redirect('/admin/addRep');
         });
      });
   },

   // app.post('/admin/denyRep', isAdmin, admin.denyRep);
   denyRep: function(req, res, next) {
      var data = req.body;
      var thisDate = Date.now();
      Addrep.update({ 'twitterName' : data.twitterName},
      { $set : { 'status' : 'denied' , 'modded' : thisDate }},
      function(err) {
         if (err) {next(err);}
         res.redirect('/admin/addRep');
      });
   },

   // app.get('/admin/editReps', isAdmin, admin.editReps);
   editReps: function(req, res, next) {

   },

   // app.get('/admin/editRep/:id', isAdmin, admin.editRep);
   editRep: function(req, res, next) {

   },

   // app.post('/admin/editRep', isAdmin, admin.postEdit);
   postEdit: function(req, res, next) {

   }

};