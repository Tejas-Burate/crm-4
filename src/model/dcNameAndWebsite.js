const mongoose = require("mongoose");

const dcNameAndWebsite = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
   
    name: String,
    
    website: String,
  },
  { collection: "dcNameAndWebsite" }
);

const DCNAW = mongoose.model("dcNameAndWebsite", dcNameAndWebsite);

module.exports = DCNAW;
