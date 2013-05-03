
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
   User.findOne({'tid': id}, function (err, user) {
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
         // if one found, check to see if their profile changed and update if needed
         // If not, create user
         if (user) {
            var updateNeeded = false;
            if ( user.name !== profile.displayName ) {
               user.name = profile.displayName;
               updateNeeded = true;
            }
            if ( user.accessToken !== token ) {
               user.accessToken = token;
               updateNeeded = true;
            }
            if ( user.accessTokenSecret !== tokenSecret ) {
               user.accessTokenSecret = tokenSecret;
               updateNeeded = true;
            }
            if (updateNeeded) {
               user.save(function(err) {
                  if(err) { next(err); }
                  done(null, user);
               });
            } else {
               done(null, user);
            }
         } else {
            var user = new User();
            user.tid = profile.id;
            user.name = profile.displayName;
            user.username = profile.username;
            user.accessToken = token;
            user.accessTokenSecret = tokenSecret;
            user.save(function(err) {
               if(err) { next(err); }
               done(null, user);
            });
         }
      });
   }
));

module.exports = passport;

