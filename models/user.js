// user.js - the user database model

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
   tid : String,
   name: String,
   username: String,
   accessToken: String,
   accessTokenSecret: String,
   created: { type: Date, default: Date.now }
}, {
   collection: "users"
});

module.exports = mongoose.model("User", UserSchema);
