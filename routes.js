// Route Definitions
var passport = require('passport');

//Include Routing Subfiles
var home = require('./routes/home');
var profile = require('./routes/profile');
var tweet = require('./routes/tweet');
var reps = require('./routes/reps');
var admin = require('./routes/admin');

/**
 * function restrict(req, res, next) {
 * This function checks to see if the user is logged in, 
 * and can be used in any route that requires auth
 */
function restrict(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

/**
 * function isAdmin(req, res, next)
 * This function checks to see if the user is an admin of the site
 * If not, redirects them away
 * 
 */
function isAdmin(req, res, next) {
  if (req.user._id == '51841f9a7944bd2314000001' || req.user._id == '5184263dfec24e11b8000001') {
    next();
  } else {
    res.redirect('/');
  }
}

module.exports = function(app){
// be sure to put any variable routes after any static routes (same path)
   /**
    * Home Routes - Home page, about, contact, etc
    */
   app.get('/', home.index);
   app.get('/login', home.login);
   app.get('/loginError', home.loginError);
   app.get('/about', home.about);
   app.get('/about/tos', home.tos);

   /**
    * Tweet Routes - Make tweets, view tweets, etc
    */
   app.get('/tweet', restrict, tweet.main);
   app.post('/tweet', restrict, tweet.send);
   app.get('/tweet/status', restrict, tweet.status);

   app.get('/tweet/:id', tweet.display); // where id is the object id of the tweet in the db

   /**
    * Profile Routes - View Profile, user tweets, etc
    */
   app.get('/profile', restrict, profile.mine);
   app.get('/profile/state', restrict, profile.state);
   app.post('/profile/state', restrict, profile.changeState);

   app.get('/profile/:uname', profile.display); // query based on twitter username

   /**
    * Reps Routes - View Rep Profile, Reps for a state, etc
    */
   app.get('/reps', reps.main);

   app.get('/reps/add', restrict, reps.addForm);
   app.post('/reps/add', restrict, reps.add);
   app.get('/reps/add/view', restrict, reps.viewAdds);
   app.get('/reps/fix/:rep', restrict, reps.fixForm);
   app.post('/reps/fix', restrict, reps.fix);

   app.get('/reps/:uname', reps.one); //- uname being the twitter username of a representative

   /**
    * Administrative Routes
    */
   app.get('/admin', isAdmin, admin.admin);
   app.get('/admin/addRep', isAdmin, admin.showReps);
   app.get('/admin/addRep/:id?', isAdmin, admin.addRep);
   app.post('/admin/addRep', isAdmin, admin.postRep);
   app.post('/admin/denyRep', isAdmin, admin.denyRep);
   app.get('/admin/editReps', isAdmin, admin.editReps);
   app.get('/admin/editRep/:id', isAdmin, admin.editRep);
   app.post('/admin/editRep', isAdmin, admin.postEdit);
   // might need to do some user banning and such too

   /**
    * Passport Twitter auth routes
    */

   // Redirect the user to Twitter for authentication.  When complete, Twitter
   // will redirect the user back to the application at
   //   /auth/twitter/callback
   app.get('/auth/twitter', passport.authenticate('twitter'));

   // Twitter will redirect the user to this URL after approval.  Finish the
   // authentication process by attempting to obtain an access token.  If
   // access was granted, the user will be logged in.  Otherwise,
   // authentication has failed.
   app.get('/auth/twitter/callback', 
     passport.authenticate('twitter', { successRedirect: '/',
                                        failureRedirect: '/loginError' }));

   // and don't forget the logout
   app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
   });

};