const Employee = require("../model/employee");
const Data = require("../model/data");

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
  NorthAmerica: [
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
    "United States Virgin Islands",
  ],
  SouthAmerica: [
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

// const industries = {
//   Accounting: ["Accounting"],
//   Administration: ["Administration of Justice"],
//   Advertising: ["Advertising Services", "Advertising"],
//   Airlines and Aviation: ["Airlines and Aviation", "Airlines/Aviation", "Aviation & Aerospace"],
//   Animation: ["Animation", "Animation and Post-production"],
//   Architecture and Planning: ["Architecture and Planning", "Architecture & Planning"],
//   Armed Forces: ["Armed Forces"],
//   Automation: ["Automation", "Automotive", "Automation Machinery Manufacturing"],
//   Banking: ["Banking"],
//   Biotechnology: ["Biotechnology", "Biotechnology Research"],
//   Broadcast Media: ["Broadcast Media", "Broadcast", "Broadcast Media Production and Distribution"],
//   Business: ["Business", "Business Consulting and Services", "Business Intelligence Platforms", "Business Skills Training", "Business Supplies and Equipment"],
//   Civil: ["Civic & Social Organization", "Civic and Social Organizations", "Civil Engineering"],
//   Computer: [
//     "Computer & Network Security",
//     "Computer and Network Security",
//     "Computer Games",
//     "Computer Hardware",
//     "Computer Hardware Manufacturing",
//     "Computer Networking",
//     "Computer Networking Products",
//     "Computer Software",
//     "Computers and Electronics Manufacturing",
//   ],
//   Construction: ["Residential Building Construction", "Construction"],
//   Consumer: ["Consumer Electronics", "Consumer Goods", "Consumer Services"],
//   Dairy: ["Dairy", "Dairy Product Manufacturing"],
//   Defense & Space: ["Defense & Space", "Defense and Space Manufacturing"],
//   Design: ["Design Services", "Design"],
//   Education: ["Education", "Education Administration Programs", "Education Management", "E-Learning", "E-Learning Providers", "Higher Education", "Primary and Secondary Education", "Primary/Secondary Education"],
//   Professional Services: ["Professional Services", "Professional Training & Coaching"],
//   Electric: ["Electric Power Generation", "Electric Power Transmission", "Control, and Distribution", "Electrical/Electronic Manufacturing"],
//   Entertainment: ["Entertainment", "Entertainment Providers"],
//   Environment: ["Environmental Quality Programs", "Environmental Services"],
//   Executive Office: ["Executive Office", "Executive Offices"],
//   Farming: ["Farming", "Ranching", "Forestry"],
//   Fishery: ["Fisheries", "Fishery"],
//   Food: ["Food & Beverages", "Food", "Food and Beverage Manufacturing", "Food and Beverage Services", "Food Production"],
//   Fund: ["Fundraising", "Fund", "Fund-Raising"],
//   Furniture: ["Furniture", "Furniture and Home Furnishings Manufacturing"],
//   Gambling and Casinos: ["Gambling & Casinos", "Gambling and Casinos", "Gambling Facilities and Casinos"],
//   Glass, Ceramics & Concrete: ["Glass, Ceramics & Concrete", "Glass", "Ceramics and Concrete Manufacturing"],
//   Government: ["Government Administration", "Government Relations", "Government Relations Services"],
//   Health and Fitness: ["Health and Fitness", "Health and Human Services", "Health, Wellness and Fitness"],
//   Hospitality: ["Hospital & Health Care", "Hospitality", "Hospitals and Health Care"],
//   Human Resources: ["Human Resources", "Human Resources Services"],
//   Individual and Family Services: ["Individual & Family Services", "Individual and Family Services"],
//   Internet: ["Internet", "Internet Marketplace Platforms", "Internet News", "Internet Publishing"],
//   Investment: ["Investment Banking", "Investment Management"],
//   IT Services: [
//     "Desktop Computing Software Products",
//     "Embedded Software Products",
//     "Information Services",
//     "Information Technology and Services",
//     "IT Services and IT Consulting",
//     "IT System Design Services",
//     "Software Development",
//     "Technology and Information Technology",
//     "Information and Media"
//   ],
//   Law: ["Law Enforcement", "Law Practice"],
//   Leasing: ["Leasing Non-residential Real Estate", "Leasing Real Estate"],
//   Legal Services: ["Legal Services"],
//   Legislative Offices: ["Legislative Offices"],
//   Leisure, Travel & Tourism: ["Leisure, Travel & Tourism"],
//   Machinery: ["Machinery", "Machinery Manufacturing"],
//   Maritime: ["Maritime", "Maritime Transportation"],
//   Market Research: ["Market Research"],
//   Marketing: ["Marketing and Advertising", "Marketing Services"],
//   Mechanical: ["Mechanical or Industrial Engineering", "Mechanical"],
//   Media: ["Media Production"],
//   Mental Health Care: ["Mental Health Care"],
//   Metal Treatments: ["Metal Treatments"],
//   Military: ["Military"],
//   Mining: ["Mining", "Mining & Metals"],
//   Mobile: ["Mobile Computing Software Products", "Mobile Gaming Apps", "Mobile"],
//   Motion Pictures and Film: ["Motion Pictures and Film"],
//   Motor Vehicle: ["Motor Vehicle Manufacturing", "Motor Vehicle", "Motor Vehicle Parts Manufacturing"],
//   Movies and Sound Recording: ["Movies and Sound Recording"],
//   Mueseum And Zoos: ["Museums and Institutions", "Museums, Historical Sites, and Zoos"],
//   Music: ["Music", "Musicians"],
//   Nanotechnology: ["Nanotechnology", "Nanotechnology Research"],
//   Newspaper: ["Newspaper Publishing", "Newspapers"],
//   Non-profit Organizations: ["Nonprofit Organization Management", "Non-profit Organizations"],
//   Oil and Gas: ["Oil & Energy", "Oil and Gas"],
//   Online: ["Online and Mail Order Retail", "Online Audio and Video Media", "Online Media"],
//   Outsourcing: ["Outsourcing and Offshoring Consulting", "Outsourcing/Offshoring"],
//   Packaging: ["Package/Freight Delivery", "Packaging and Containers", "Packaging and Containers Manufacturing"],
//   Paper And Forest: ["Paper & Forest Products", "Paper and Forest Product Manufacturing"],
//   Performing Arts: ["Performing Arts", "Performing Arts and Spectator Sports"],
//   Periodical Publishing: ["Periodical Publishing"],
//   Pharmaceuticals: ["Alternative Medicine", "Medical and Diagnostic Laboratories", "Medical Devices", "Medical Equipment Manufacturing", "Medical Practice", "Medical Practices", "Pharmaceutical Manufacturing", "Pharmaceuticals"],
//   Philanthropy: ["Philanthropic Fundraising Services", "Philanthropy"],
//   Photography: ["Photography"],
//   Political: ["Political Organization", "Political Organizations"],
//   Printing Services: ["Printing", "Printing Services"],
//   Program Development: ["Program Development"],
//   Public: ["Public Health", "Public Policy", "Public Policy Offices", "Public Relations and Communications", "Public Relations and Communications Services", "Public Safety"],
//   Publishing: ["Publishing"],
//   Railroad And Transport: ["Rail Transportation", "Railroad Equipment Manufacturing", "Railroad Manufacture"],
//   Ranching: ["Ranching"],
//   Real Estate: ["Real Estate", "Real Estate Agents and Brokers"],
//   Recreational Facilities: ["Recreational Facilities", "Recreational Facilities and Services"],
//   Religious Institutions: ["Religious Institutions"],
//   Renewable: ["Renewable Energy Semiconductor Manufacturing", "Renewable", "Renewables & Environment"],
//   Research Services: ["Research", "Research Services"],
//   Restaurants: ["Restaurants"],
//   Retail: ["Retail", "Retail Apparel and Fashion", "Retail Art Supplies", "Retail Groceries", "Retail Health and Personal Care Products", "Retail Luxury Goods and Jewelry", "Retail Motor Vehicles", "Retail Office Equipment", "Retail Recyclable Materials & Used Merchandise"],
//   Security: ["Security and Investigations", "Security Systems Services", "Security"],
//   Shipbuilding: ["Shipbuilding"],
//   Social Networking Platforms: ["Social Networking Platforms"],
//   Space Research and Technology: ["Space Research and Technology"],
//   Sports: ["Spectator Sports", "Sporting Goods", "Sporting Goods Manufacturing", "Sports", "Sports and Recreation Instruction"],
//   Staffing and Recruiting: ["Staffing and Recruiting"],
//   Strategic Management Services: ["Strategic Management Services"],
//   Supermarkets: ["Supermarkets"],
//   Technical and Vocational Training: ["Technical and Vocational Training"],
//   Telecommunications: ["Telecommunications"],
//   Tobacco: ["Tobacco", "Tobacco Manufacturing"],
//   Translation and Localization: ["Translation and Localization", "Transportation", "Freight and Package Transportation", "Logistics and Supply Chain", "Transportation Equipment Manufacturing", "Transportation Programs", "Transportation", "Logistics and Storage", "Transportation/Trucking/Railroad", "Travel Arrangements", "Truck Transportation"],
//   Utilities: ["Utilities", "Utility System Construction"],
//   Vehicle Repair and Maintenance: ["Vehicle Repair and Maintenance"],
//   Venture Capital: ["Venture Capital & Private Equity", "Venture Capital and Private Equity Principals"],
//   Veterinary Services: ["Veterinary", "Veterinary Services"],
//   Warehousing: ["Warehousing", "Warehousing and Storage"],
//   Wellness and Fitness Services: ["Wellness and Fitness Services"],
//   Wholesale: ["Wholesale", "Wholesale Building Materials", "Wholesale Computer Equipment", "Wholesale Import and Export"],
//   Wine and Spirits: ["Wine and Spirits"],
//   Wireless Services: ["Wireless", "Wireless Services"],
//   Writing and Editing: ["Writing and Editing"],
//   Financial Services: ["Financial Services"],
//   Insurance: ["Insurance"],
//   Appliances, Electrical, and Electronics Manufacturing: ["Appliances, Electrical, and Electronics Manufacturing"],
//   International Trade and Development: ["International Trade and Development"],
//   Manufacturing: ["Audio and Video Equipment Manufacturing", "Beverage Manufacturing", "Chemical Manufacturing", "Chemicals", "Industrial Machinery Manufacturing", "Manufacturing", "Personal Care Product Manufacturing", "Plastics", "Plastics Manufacturing", "Semiconductor Manufacturing", "Semiconductors", "Textile Manufacturing", "Textiles"],
//   Think Tanks: ["Think Tanks"],
//   Book and Periodical Publishing: ["Book and Periodical Publishing"],
//   Capital Markets: ["Capital Markets"],
//   Management Consulting: ["Management Consulting"],
//   Events Services: ["Events Services"],
//   Facilities Services: ["Facilities Services"],
//   Apparel & Fashion: ["Apparel & Fashion"],
//   Commercial Real Estate: ["Commercial Real Estate"],
//   Graphic Design: ["Graphic Design"],
//   Building Materials: ["Building Materials"],
//   Industrial Automation: ["Industrial Automation"],
//   International Affairs: ["International Affairs"],
//   Import and Export: ["Import and Export"],
//   Artists: ["Artists and Writers", "Arts and Crafts"],
//   Libraries: ["Libraries"],
//   Luxury Goods & Jewelry: ["Luxury Goods & Jewelry"],
//   Fine Art: ["Fine Art"],
//   Cosmetics: ["Cosmetics"],
//   Alternative Dispute Resolution: ["Alternative Dispute Resolution"],
//   Data Infrastructure and Analytics: ["Data Infrastructure and Analytics"],
//   Blogs: ["Blogs"],
//   Fire Protection: ["Fire Protection"],
//   Industry Associations: ["Industry Associations"],
//   Golf Courses and Country Clubs: ["Golf Courses and Country Clubs"],
//   Air, Water, and Waste Program Management: ["Air, Water, and Waste Program Management"],
//   Community Development and Urban Planning: ["Community Development and Urban Planning"],
//   Hydroelectric Power Generation: ["Hydroelectric Power Generation"],
//   Language Schools: ["Language Schools"],
// };

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
    const totalPage = Math.ceil(totalRecords / length);
    const filteredPages = Math.ceil(data.length / length);

    // const result = {
    //   recordsTotal: totalRecords,
    //   recordsFiltered: data.length,
    //   totalPages: totalPage,
    //   currentPage: filteredPages,
    //   recordsPerPage: length,
    //   data: data,
    // };

    res.status(200).json({
      totalRecords,
      totalPages,
      filteredRecords: data.length,
      filteredPages,
      data,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: 500,
      error: "500",
      message: "Internal Server Error",
    });
  }
};

const accountCount = async (req, res) => {
  try {
    const cnt = await Data.countDocuments();
    res.status(200).json({ count: cnt });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

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
  accountCount,
  employeeFilter,
  searchByJobTitle,
  searchByDepartment,
  searchByDepartmentAndJobTitle,
  filterEmailAndCompanyName,
};
