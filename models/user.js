// user.js - the user database model

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
   tid : String,
   name: String,
   username: String,
   photo: String,
   accessToken: String,
   accessTokenSecret: String,
   state: String,
   created: { type: Date, default: Date.now },
   tweets: [{
      type: ObjectId,
      ref: 'Tweet'
   }]
}, {
   collection: "users"
});

module.exports = mongoose.model("User", UserSchema);
