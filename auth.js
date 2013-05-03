
// Authentication Definition File

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

var User = require('./models/user');
var config = require('./config.js');

// serialize user on login
passport.serializeUser(function(user, done) {
   done(null, user.tid);
});

// deserialize user on logout
passport.deserializeUser(function(id, done) {
   User.findById(id, function (err, user) {
      done(err, user);
   });
});

passport.use(new TwitterStrategy({
   consumerKey: config.twitter.consumerKey,
   consumerSecret: config.twitter.consumerSecret,
   callbackURL: "http://grasstweets.com/auth/twitter/callback"
   },
   function(token, tokenSecret, profile, done) {
      User.findOne({ tid: profile.id }, function(err, user) {
         if (err) { return done(err); }
         // if one found, we're done. If not, create user
         if (user) {
            done(null, user);
         } else {
            var user = new User();
            user.tid = profile.id;
            user.name = profile.displayName;
console.log(profile);
            user.save(function(err) {
               if(err) { next(err); }
               done(null, user);
            });
         }
      });
   }
));

module.exports = passport;

