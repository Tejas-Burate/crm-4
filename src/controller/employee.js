const Employee = require("../model/employee");

const getAllCompanyList = async (req, res) => {
  try {
    const emp = await Employee.find();
    if (emp.length === 0) {
      res.status(404).json({
        status: 404,
        error: "400",
        message: "Employee data not found",
      });
      return;
    }

    res.status(200).json(emp);
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal Server Error" });
  }
};

const employeeFilter = async (req, res) => {
  try {
    const {
      start,
      length,
      fullName,
      jobTitle,
      email,
      companyName,
      domain,
      website,
      contactNumber,
      department,
      hqLocation,
      prospectLocation,
      hqNumber,
      search,
    } = req.body;

    // Define the pipeline for aggregation
    const pipeline = [];

    // Match stage to filter based on provided criteria
    const match = {};
    if (fullName) {
      match.fullName = fullName;
    }
    if (jobTitle) {
      match.jobTitle = jobTitle;
    }
    if (email) {
      match.email = email;
    }
    if (companyName) {
      match.companyName = companyName;
    }
    if (domain) {
      match.domain = domain;
    }
    if (website) {
      match.website = website;
    }
    if (contactNumber) {
      match.contactNumber = contactNumber;
    }
    if (department) {
      match.department = department;
    }
    if (hqLocation) {
      match.hqLocation = hqLocation;
    }
    if (prospectLocation) {
      match.prospectLocation = prospectLocation;
    }
    if (hqNumber) {
      match.hqNumber = hqNumber;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      match.$or = [
        { fullName: searchRegex },
        { jobTitle: searchRegex },
        { email: searchRegex },
        { domain: searchRegex },
        { companyName: searchRegex },
      ];
    }

    pipeline.push({ $match: match });

    const dataCount = await Employee.countDocuments(pipeline);
    // Skip and limit the results
    pipeline.push({ $skip: start });
    pipeline.push({ $limit: length });

    // Execute the aggregation pipeline
    const data = await Employee.aggregate(pipeline);

    const totalRecords = data.length; // Total filtered records

    if (totalRecords === 0) {
      res.status(404).json({
        status: 404,
        error: "400",
        message: "Employee data not found",
      });
      return;
    }

    const result = {
      totalRecords: dataCount,
      recordsPerPage: length,
      filteredRecords: totalRecords,
      data: data,
    };

    res.status(200).json(result);
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal Server Error" });
  }
};

// const employeeFilter = async (req, res) => {
//   try {
//     const { start, length } = req.body;

//     const emp = await Employee.find().limit(length).skip(start);
//     const count = emp.length;
//     console.log("count", count);
//     if (emp.length === 0) {
//       res.status(404).json({
//         status: 404,
//         error: "400",
//         message: "Employee data not found",
//       });
//       return;
//     }

//     res.status(200).json(emp);
//   } catch (error) {
//     console.log("error", error);
//     res
//       .status(500)
//       .json({ status: 500, error: "500", message: "Internal Server Error" });
//   }
// };

module.exports = {
  getAllCompanyList,
  employeeFilter,
};
