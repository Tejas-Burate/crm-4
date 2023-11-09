const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId, // Assuming you want to use the default ObjectId type
    fullName: String,
    jobTitle: String,
    email: String,
    companyName: String,
    domain: String,
    websit: String,
    contactNumber: String,
    department: String,
    hqLocation: String,
    prospectLocation: String,
    hqNumber: String,
  },
  // { collection: "employee-data" }
  { collection: "tempContact" }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
