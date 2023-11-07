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

    // const dataCount = await Employee.countDocuments(pipeline);
    // Skip and limit the results
    pipeline.push({ $skip: start });
    pipeline.push({ $limit: length });

    // Execute the aggregation pipeline
    const data = await Employee.aggregate(pipeline);
    const t = await Employee.countDocuments(match);
    const totalPage = Math.ceil(t / length);

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
      totalRecords: t,
      recordsPerPage: length,
      totalPages: totalPage,
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

const searchByJobTitle = async (req, res) => {
  try {
    const { jobTitle, start, length, sortField, sortOrder } = req.body;

    if (!jobTitle || !Array.isArray(jobTitle)) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "jobTitle parameter is required and should be an array",
      });
      return;
    }

    // Create a regular expression pattern for each job title in the array
    const regexPatterns = jobTitle.map((title) => new RegExp(title, "i"));

    // Define the aggregation pipeline stages
    const pipeline = [
      {
        $match: { jobTitle: { $in: regexPatterns } },
      },
    ];

    // Add sorting to the pipeline if specified
    if (sortField) {
      const sort = {};
      sort[sortField] = sortOrder === "asc" ? 1 : -1;
      pipeline.push({ $sort: sort });
    }

    // Add pagination to the pipeline
    pipeline.push({ $skip: start });
    pipeline.push({ $limit: length });

    // Execute the aggregation pipeline
    const data = await Employee.aggregate(pipeline);

    // Calculate the total count based on the matching criteria
    const countPipeline = [...pipeline]; // Clone the pipeline
    countPipeline.pop(); // Remove the $skip and $limit stages
    const count = await Employee.aggregate([
      ...countPipeline,
      { $count: "count" },
    ]);
    const totalRecords = count.length > 0 ? count[0].count : 0;

    // Calculate the total pages and filtered pages
    const totalPages = Math.ceil(totalRecords / length);
    const filteredPages = Math.ceil(data.length / length);

    res.status(200).json({
      totalRecords,
      totalPages,
      filteredRecords: data.length,
      filteredPages,
      data,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: 500,
      error: "500",
      message: "Internal Server Error",
    });
  }
};

const searchByDepartment = async (req, res) => {
  try {
    const { department, start, length, sortField, sortOrder } = req.body;

    if (!department || !Array.isArray(department)) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "department parameter is required and should be an array",
      });
      return;
    }

    // Create a regular expression pattern for each job title in the array
    const regexPatterns = department.map((title) => new RegExp(title, "i"));

    // Define the aggregation pipeline stages
    const pipeline = [
      {
        $match: { department: { $in: regexPatterns } },
      },
    ];

    // Add sorting to the pipeline if specified
    if (sortField) {
      const sort = {};
      sort[sortField] = sortOrder === "asc" ? 1 : -1;
      pipeline.push({ $sort: sort });
    }

    // Add pagination to the pipeline
    pipeline.push({ $skip: start });
    pipeline.push({ $limit: length });

    // Execute the aggregation pipeline
    const data = await Employee.aggregate(pipeline);

    // Calculate the total count based on the matching criteria
    const countPipeline = [...pipeline]; // Clone the pipeline
    countPipeline.pop(); // Remove the $skip and $limit stages
    const count = await Employee.aggregate([
      ...countPipeline,
      { $count: "count" },
    ]);
    const totalRecords = count.length > 0 ? count[0].count : 0;

    // Calculate the total pages and filtered pages
    const totalPages = Math.ceil(totalRecords / length);
    const filteredPages = Math.ceil(data.length / length);

    res.status(200).json({
      totalRecords,
      totalPages,
      filteredRecords: data.length,
      filteredPages,
      data,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: 500,
      error: "500",
      message: "Internal Server Error",
    });
  }
};

const continentsToCountries = {
  Africa: [
    "Algeria",
    "Angola",
    "Benin",
    "Botswana",
    "British Indian Ocean Territory",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cameroon",
    "Central African Republic",
    "Chad",
    "Comoros",
    "Congo",
    "Côte d’Ivoire",
    "Democratic Republic of the Congo",
    "Djibouti",
    "Egypt",
    "Equatorial Guinea",
    "Eritrea",
    "Eswatini",
    "Ethiopia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Kenya",
    "Lesotho",
    "Liberia",
    "Libya",
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Niger",
    "Nigeria",
    "Réunion",
    "Rwanda",
    "Saint Helena",
    "Sao Tome and Principe",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Sudan",
    "Togo",
    "Tunisia",
    "Uganda",
    "United Republic of Tanzania",
    "Western Sahara",
    "Zambia",
    "Zimbabwe",
  ],
  Asia: [
    "Afghanistan",
    "Armenia",
    "Azerbaijan",
    "Bahrain",
    "Bangladesh",
    "Bhutan",
    "Brunei Darussalam",
    "Cambodia",
    "China",
    "China, Hong Kong Special Administrative Region",
    "China, Macao Special Administrative Region",
    "Cyprus",
    "Democratic People's Republic of Korea",
    "Georgia",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Israel",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic",
    "Lebanon",
    "Malaysia",
    "Maldives",
    "Mongolia",
    "Myanmar",
    "Nepal",
    "Oman",
    "Pakistan",
    "Philippines",
    "Qatar",
    "Republic of Korea",
    "Saudi Arabia",
    "Singapore",
    "Sri Lanka",
    "State of Palestine",
    "Syrian Arab Republic",
    "Tajikistan",
    "Thailand",
    "Timor-Leste",
    "Turkey",
    "Turkmenistan",
    "United Arab Emirates",
    "Uzbekistan",
    "Viet Nam",
    "Yemen",
  ],
  Europe: [
    "Åland Islands",
    "Albania",
    "Andorra",
    "Austria",
    "Belarus",
    "Belgium",
    "Bosnia and Herzegovina",
    "Bulgaria",
    "Croatia",
    "Czechia",
    "Denmark",
    "Estonia",
    "Faroe Islands",
    "Finland",
    "France",
    "Germany",
    "Gibraltar",
    "Greece",
    "Guernsey",
    "Holy See",
    "Hungary",
    "Iceland",
    "Ireland",
    "Isle of Man",
    "Italy",
    "Jersey",
    "Latvia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Monaco",
    "Montenegro",
    "Netherlands",
    "North Macedonia",
    "Norway",
    "Poland",
    "Portugal",
    "Republic of Moldova",
    "Romania",
    "Russian Federation",
    "San Marino",
    "Sark",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Svalbard and Jan Mayen Islands",
    "Sweden",
    "Switzerland",
    "Ukraine",
    "United Kingdom",
    "United Kingdom of Great Britain and Northern Ireland",
  ],
  America: [
    "Anguilla",
    "Antigua and Barbuda",
    "Aruba",
    "Bahamas",
    "Barbados",
    "Belize",
    "Bermuda",
    "Bonaire, Sint Eustatius and Saba",
    "British Virgin Islands",
    "Canada",
    "United States",
    "Cayman Islands",
    "Costa Rica",
    "Cuba",
    "Curaçao",
    "Dominica",
    "Dominican Republic",
    "El Salvador",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guatemala",
    "Haiti",
    "Honduras",
    "Jamaica",
    "Martinique",
    "Mexico",
    "Montserrat",
    "Nicaragua",
    "Panama",
    "Puerto Rico",
    "Saint Barthélemy",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "San Francisco",
    "Saint Martin (French Part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Sint Maarten (Dutch part)",
    "Trinidad and Tobago",
    "Turks and Caicos Islands",
    "United States of America",
    "United States Virgin Islands",
    "Argentina",
    "Bolivia (Plurinational State of)",
    "Bouvet Island",
    "Brazil",
    "Chile",
    "Colombia",
    "Ecuador",
    "Falkland Islands (Malvinas)",
    "French Guiana",
    "Guyana",
    "Paraguay",
    "Peru",
    "South Georgia and the South Sandwich Islands",
    "Suriname",
    "Uruguay",
    "Venezuela (Bolivarian Republic of)",
  ],
  Australia: [
    "Australia",
    "Fiji",
    "Kiribati",
    "Marshall Islands",
    "Micronesia",
    "Nauru",
    "New Zealand",
    "Palau",
    "Papua New Guinea",
    "Samoa",
    "Solomon Islands",
    "Tonga",
    "Tuvalu",
    "Vanuatu",
  ],
};

const searchByDepartmentAndJobTitle = async (req, res) => {
  try {
    const {
      department,
      jobTitle,
      start,
      length,
      sortField,
      sortOrder,
      searchByCompanyAndEmail,
      search,
      searchByCountry,
      continent,
    } = req.body;

    const pipeline = [];

    // Apply additional filters for 'jobTitle'
    if (Array.isArray(jobTitle) && jobTitle.length > 0) {
      pipeline.push({
        $match: {
          jobTitle: { $in: jobTitle.map((title) => new RegExp(title, "i")) },
        },
      });
    }

    // Apply filter for 'continent' using continentsToCountries
    if (continent && continent.length > 0) {
      const continentFilters = continent.map((c) => ({
        prospectLocation: { $in: continentsToCountries[c] || [] },
      }));
      pipeline.push({ $match: { $or: continentFilters } });
    }

    if (searchByCountry) {
      pipeline.push({
        $match: {
          prospectLocation: { $regex: new RegExp(searchByCountry + "$", "i") },
        },
      });
    }

    // Apply search by company and email if specified
    if (searchByCompanyAndEmail) {
      const companyEmailMatch = {
        $or: [
          { email: { $regex: new RegExp(searchByCompanyAndEmail, "i") } },
          { companyName: { $regex: new RegExp(searchByCompanyAndEmail, "i") } },
        ],
      };
      pipeline.push({ $match: companyEmailMatch });
    }

    // Apply search if specified
    if (search) {
      pipeline.push({
        $match: {
          fullName: { $regex: new RegExp(search, "i") },
        },
      });
    }

    // Handle 'department' filter
    if (Array.isArray(department) && department.length > 0) {
      pipeline.push({
        $match: {
          department: { $in: department.map((dept) => new RegExp(dept, "i")) },
        },
      });
    }

    // Sorting
    if (sortField) {
      const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 };
      pipeline.push({ $sort: sort });
    }

    // Pagination
    pipeline.push({ $skip: start });
    pipeline.push({ $limit: length });

    // Execute the aggregation pipeline
    const data = await Employee.aggregate(pipeline);

    // Calculate the total count based on the matching criteria
    const countPipeline = pipeline.slice(0, -2); // Remove skip and limit stages
    const count = await Employee.aggregate([
      ...countPipeline,
      { $count: "count" },
    ]);
    const totalRecords = count.length > 0 ? count[0].count : 0;

    // Calculate the total pages and filtered pages
    const totalPages = Math.ceil(totalRecords / length);
    const filteredPages = Math.ceil(data.length / length);

    res.status(200).json({
      totalRecords,
      totalPages,
      filteredRecords: data.length,
      filteredPages,
      data,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: 500,
      error: "500",
      message: "Internal Server Error",
    });
  }
};

// const searchByDepartmentAndJobTitle = async (req, res) => {
//   try {
//     const {
//       department,
//       jobTitle,
//       start,
//       length,
//       sortField,
//       sortOrder,
//       continent,
//       searchByCompanyAndEmail,
//       search,
//     } = req.body;

//     if (!Array.isArray(department)) {
//       res.status(400).json({
//         status: 400,
//         error: "400",
//         message: "department parameter should be an array",
//       });
//       return;
//     }

//     const total = await Employee.countDocuments();
//     console.log("total", total);

//     // Create regular expression patterns for department and jobTitle arrays
//     const departmentRegexPatterns = department.map(
//       (dept) => new RegExp(dept, "i")
//     );

//     // Define the aggregation pipeline stages
//     const pipeline = [
//       {
//         $match: {
//           department: { $in: departmentRegexPatterns },
//         },
//       },
//     ];

//     // Apply additional filters if specified
//     if (jobTitle.length > 0) {
//       const jobTitleRegexPatterns = jobTitle.map(
//         (title) => new RegExp(title, "i")
//       );
//       pipeline[0].$match.jobTitle = { $in: jobTitleRegexPatterns };
//     }

//     if (continent && continent.length > 0) {
//       pipeline[0].$match.continent = { $in: continent };
//     }

//     if (searchByCompanyAndEmail) {
//       pipeline.push({
//         $match: {
//           $or: [
//             { email: { $regex: new RegExp(searchByCompanyAndEmail, "i") } },
//             {
//               companyName: { $regex: new RegExp(searchByCompanyAndEmail, "i") },
//             },
//           ],
//         },
//       });
//     }

//     // Apply search if specified
//     if (search) {
//       pipeline.push({
//         $match: {
//           fullName: { $regex: new RegExp(search, "i") },
//         },
//       });
//     }

//     // Add sorting to the pipeline if specified
//     if (sortField) {
//       const sort = {};
//       sort[sortField] = sortOrder === "asc" ? 1 : -1;
//       pipeline.push({ $sort: sort });
//     }

//     // Add pagination to the pipeline
//     pipeline.push({ $skip: start });
//     pipeline.push({ $limit: length });

//     // Execute the aggregation pipeline
//     const data = await Employee.aggregate(pipeline);

//     // Calculate the total count based on the matching criteria
//     const countPipeline = [...pipeline]; // Clone the pipeline
//     countPipeline.pop(); // Remove the $skip and $limit stages
//     const count = await Employee.aggregate([
//       ...countPipeline,
//       { $count: "count" },
//     ]);
//     const totalRecords = count.length > 0 ? count[0].count : 0;

//     // Calculate the total pages and filtered pages
//     const totalPages = Math.ceil(totalRecords / length);
//     const filteredPages = Math.ceil(data.length / length);

//     res.status(200).json({
//       totalRecords,
//       totalPages,
//       filteredRecords: data.length,
//       filteredPages,
//       data,
//     });
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).json({
//       status: 500,
//       error: "500",
//       message: "Internal Server Error",
//     });
//   }
// };

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

const filterEmailAndCompanyName = async (req, res) => {
  try {
    const { searchByCompanyAndEmail } = req.body;

    if (!searchByCompanyAndEmail) {
      return res.status(400).json({
        status: 400,
        error: "400",
        message: "searchByCompanyAndEmail parameter is required",
      });
    }

    // Create a regular expression pattern for searchByCompanyAndEmail
    const regexPattern = new RegExp(searchByCompanyAndEmail, "i");

    // Define the aggregation pipeline stages
    const pipeline = [
      {
        $match: {
          $or: [
            { companyName: { $regex: regexPattern } },
            { email: { $regex: regexPattern } },
          ],
        },
      },
    ];

    // Execute the aggregation pipeline
    const data = await Employee.aggregate(pipeline);

    res.status(200).json({
      filteredRecords: data.length,
      data,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: 500,
      error: "500",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllCompanyList,
  employeeFilter,
  searchByJobTitle,
  searchByDepartment,
  searchByDepartmentAndJobTitle,
  filterEmailAndCompanyName,
};
