const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: String,
  about: String,
  affiliated: [String], // Assuming it's an array of strings
  company_id: Number,
  company_size: String,
  country_code: String,
  crunchbase_url: String,
  employees: [String], // Assuming it's an array of strings
  employees_in_linkedin: Number,
  followers: String,
  founded: Number,
  funding: Object, // Assuming it's an object
  headquarters: String,
  industries: String,
  investors: [String], // Assuming it's an array of strings
  jobs: String,
  locations: [String], // Assuming it's an array of strings
  logo: String,
  name: String,
  organization_type: String,
  region: String,
  similar: [{ title: String, subtitle: String, link: String }], // Assuming it's an array of objects
  slogan: String,
  specialties: String,
  sphere: String,
  type: String,
  url: String,
  website: String,
}, { collection: 'data-collection' }
);

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
