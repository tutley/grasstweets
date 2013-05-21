// addrep.js - a collection of user added representatives

// body can be "US House", "US Senate", "State House" or "State Senate"
// party can be "Republican", "Democrat", or "Other"
// status can be: 'confirmed', 'denied', or 'new'
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AddrepSchema = new Schema({
   twitterName : String,
   name: String,
   photo: String,
   state: String,
   body: String,
   party: String,
   addedBy: {
      type: ObjectId,
      ref: 'User'
   },
   status: { type: String, default: 'new' },
   added: {type: Date, default: Date.now},
   modded: Date
}, {
   collection: "addreps"
});

module.exports = mongoose.model("Addrep", AddrepSchema);
