const mongoose = require("mongoose");

const progressiveInsuranceSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    about: String,
    affiliated: String,
    company_id: Number,
    company_size: String,
    country_code: String,
    crunchbase_url: String,
    employees: String,
    employees_in_linkedin: Number,
    followers: Number,
    founded: Number,
    funding: String,
    headquarters: String,
    industries: String,
    investors: String,
    jobs: String,
    locations: [String],
    logo: String,
    name: String,
    organization_type: String,
    region: String,
    similar: String,
    slogan: String,
    specialties: String,
    sphere: String,
    type: String,
    url: String,
    website: String,
  },
  { collection: "data-collection" }
);

const Data = mongoose.model("ProgressiveInsurance", progressiveInsuranceSchema);

module.exports = Data;
