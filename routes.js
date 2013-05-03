// Route Definitions
var passport = require('passport');

//Include Routing Subfiles
var home = require('./routes/home');
var user = require('./routes/user');

/**
 * function restrict(req, res, next) {
 * This function checks to see if the user is logged in, 
 * and can be used in any route that requires auth
 */
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

module.exports = function(app){

   /**
    * Home Routes - Home page, about, contact, etc
    */
   app.get('/', home.index);
   app.get('/loginError', home.loginError);

   /**
    * Tweet Routes - Make tweets, view tweets, etc
    */


   /**
    * Profile Routes - View Profile, user tweets, etc
    */


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