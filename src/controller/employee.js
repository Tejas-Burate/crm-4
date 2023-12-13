const Employee = require("../model/employee");
const Local = require("../model/data");
const Data = require("../model/data");
const DCNAW = require("../model/dcNameAndWebsite");
const { ObjectId } = require('mongodb');

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

const chartForJobTitles =async (req, res) => {
  try {
    const jobTitles = [
      "Software Engineer"
      // "Marketing Manager",
      // "Sales Associate",
      // "Chief Financial Officer (CFO)",
      // "Customer Service Representative",
      // "Human Resources Specialist",
      // "Data Analyst",
      // "Operations Manager",
      // "Graphic Designer",
      // "Product Manager",
      // "Research Scientist",
      // "IT Support Specialist",
      // "Executive Assistant",
      // "Project Manager",
      // "Healthcare Administrator",
      // "Legal Counsel",
      // "Quality Assurance Engineer",
      // "Social Media Coordinator",
      // "Business Development Representative",
      // "UX/UI Designer"
    ]

    const jobTitleSizeCounts = await Employee.aggregate([
      {
        $match: {
          $or: jobTitles.map(title => ({ jobTitle: { $regex: new RegExp(title, 'i') } })),
        },
        
              
      },
      {
        $group: {
          _id: "$jobTitle",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          jobTitle: "$_id",
          count: 1,
        },
      },
    ]).exec();

    const result = {
      total: 0,
    };

    console.log("jobTitleSizeCounts",jobTitleSizeCounts)

    jobTitleSizeCounts.forEach(({ jobTitle, count }) => {
      result[jobTitle] = count;
      // result.total += count;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// const chartForJobTitles = async (req, res) => {
//   try {
//     const jobTitles = [
//       "Software Engineer",
//       "Marketing Manager",
//       "Sales Associate",
//       "Chief Financial Officer (CFO)",
//       "Customer Service Representative",
//       "Human Resources Specialist",
//       "Data Analyst",
//       "Operations Manager",
//       "Graphic Designer",
//       "Product Manager",
//       "Research Scientist",
//       "IT Support Specialist",
//       "Executive Assistant",
//       "Project Manager",
//       "Healthcare Administrator",
//       "Legal Counsel",
//       "Quality Assurance Engineer",
//       "Social Media Coordinator",
//       "Business Development Representative",
//       "UX/UI Designer"
//     ];

//     const regexJobTitles = jobTitles.map(title => new RegExp(title, 'i'));

//     const jobTitleSizeCounts = await Employee.aggregate([
//       {
//         $match: {
//           jobTitle: { $in: regexJobTitles },
//         },
//       },
//       {
//         $group: {
//           _id: "$jobTitle",
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           jobTitle: "$_id",
//           count: 1,
//         },
//       },
//     ]).exec();

//     const result = {
//       total: 0,
//     };

//     console.log("jobTitleSizeCounts", jobTitleSizeCounts);

//     jobTitleSizeCounts.forEach(({ jobTitle, count }) => {
//       result[jobTitle] = count;
//       // result.total += count;
//     });

//     res.status(200).json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };



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

const chartForIndustries = async (req, res) => {
  try {
    const industryMappings = {
      Accounting: ["Accounting"],
      Administration: ["Administration of Justice"],
      Advertising: ["Advertising Services", "Advertising"],
      AirlinesAndAviation: [
        "Airlines and Aviation",
        "Airlines/Aviation",
        "Aviation & Aerospace",
      ],
      Animation: ["Animation", "Animation and Post-production"],
      ArchitectureAndPlanning: [
        "Architecture and Planning",
        "Architecture & Planning",
      ],
      ArmedForces: ["Armed Forces"],
      Automation: [
        "Automation",
        "Automotive",
        "Automation Machinery Manufacturing",
      ],
      Banking: ["Banking"],
      Biotechnology: ["Biotechnology", "Biotechnology Research"],
      BroadcastMedia: [
        "Broadcast Media",
        "Broadcast",
        "Broadcast Media Production and Distribution",
      ],
      Business: [
        "Business",
        "Business Consulting and Services",
        "Business Intelligence Platforms",
        "Business Skills Training",
        "Business Supplies and Equipment",
      ],
      Civil: [
        "Civic & Social Organization",
        "Civic and Social Organizations",
        "Civil Engineering",
      ],
      Computer: [
        "Computer & Network Security",
        "Computer and Network Security",
        "Computer Games",
        "Computer Hardware",
        "Computer Hardware Manufacturing",
        "Computer Networking",
        "Computer Networking Products",
        "Computer Software",
        "Computers and Electronics Manufacturing",
      ],
      Construction: ["Residential Building Construction", "Construction"],
      Consumer: ["Consumer Electronics", "Consumer Goods", "Consumer Services"],
      Dairy: ["Dairy", "Dairy Product Manufacturing"],
      DefenseAndSpace: ["Defense & Space", "Defense and Space Manufacturing"],
      Design: ["Design Services", "Design"],
      Education: [
        "Education",
        "Education Administration Programs",
        "Education Management",
        "E-Learning",
        "E-Learning Providers",
        "Higher Education",
        "Primary and Secondary Education",
        "Primary/Secondary Education",
      ],
      ProfessionalServices: [
        "Professional Services",
        "Professional Training & Coaching",
      ],
      Electric: [
        "Electric Power Generation",
        "Electric Power Transmission",
        "Control, and Distribution",
        "Electrical/Electronic Manufacturing",
      ],
      Entertainment: ["Entertainment", "Entertainment Providers"],
      Environment: ["Environmental Quality Programs", "Environmental Services"],
      ExecutiveOffice: ["Executive Office", "Executive Offices"],
      Farming: ["Farming", "Ranching", "Forestry"],
      Fishery: ["Fisheries", "Fishery"],
      Food: [
        "Food & Beverages",
        "Food",
        "Food and Beverage Manufacturing",
        "Food and Beverage Services",
        "Food Production",
      ],
      Fund: ["Fundraising", "Fund", "Fund-Raising"],
      Furniture: ["Furniture", "Furniture and Home Furnishings Manufacturing"],
      GamblingAndCasinos: [
        "Gambling & Casinos",
        "Gambling and Casinos",
        "Gambling Facilities and Casinos",
      ],
      GlassCeramicsAndConcrete: [
        "Glass, Ceramics & Concrete",
        "Glass",
        "Ceramics and Concrete Manufacturing",
      ],
      Government: [
        "Government Administration",
        "Government Relations",
        "Government Relations Services",
      ],
      HealthAndFitness: [
        "Health and Fitness",
        "Health and Human Services",
        "Health, Wellness and Fitness",
      ],
      Hospitality: [
        "Hospital & Health Care",
        "Hospitality",
        "Hospitals and Health Care",
      ],
      HumanResources: ["Human Resources", "Human Resources Services"],
      IndividualAndFamilyServices: [
        "Individual & Family Services",
        "Individual and Family Services",
      ],
      Internet: [
        "Internet",
        "Internet Marketplace Platforms",
        "Internet News",
        "Internet Publishing",
      ],
      Investment: ["Investment Banking", "Investment Management"],
      ITServices: [
        "Desktop Computing Software Products",
        "Embedded Software Products",
        "Information Services",
        "Information Technology and Services",
        "IT Services and IT Consulting",
        "IT System Design Services",
        "Software Development",
        "Technology and Information Technology",
        "Information and Media",
      ],
      Law: ["Law Enforcement", "Law Practice"],
      Leasing: ["Leasing Non-residential Real Estate", "Leasing Real Estate"],
      LegalServices: ["Legal Services"],
      LegislativeOffices: ["Legislative Offices"],
      LeisureTravelAndTourism: ["Leisure, Travel & Tourism"],
      Machinery: ["Machinery", "Machinery Manufacturing"],
      Maritime: ["Maritime", "Maritime Transportation"],
      MarketResearch: ["Market Research"],
      Marketing: ["Marketing and Advertising", "Marketing Services"],
      Mechanical: ["Mechanical or Industrial Engineering", "Mechanical"],
      Media: ["Media Production"],
      MentalHealthCare: ["Mental Health Care"],
      MetalTreatments: ["Metal Treatments"],
      Military: ["Military"],
      Mining: ["Mining", "Mining & Metals"],
      Mobile: [
        "Mobile Computing Software Products",
        "Mobile Gaming Apps",
        "Mobile",
      ],
      MotionPicturesAndFilm: ["Motion Pictures and Film"],
      MotorVehicle: [
        "Motor Vehicle Manufacturing",
        "Motor Vehicle",
        "Motor Vehicle Parts Manufacturing",
      ],
      MoviesAndSoundRecording: ["Movies and Sound Recording"],
      MueseumAndZoos: [
        "Museums and Institutions",
        "Museums, Historical Sites, and Zoos",
      ],
      Music: ["Music", "Musicians"],
      Nanotechnology: ["Nanotechnology", "Nanotechnology Research"],
      Newspaper: ["Newspaper Publishing", "Newspapers"],
      NonprofitOrganizations: [
        "Nonprofit Organization Management",
        "Non-profit Organizations",
      ],
      OilAndGas: ["Oil & Energy", "Oil and Gas"],
      Online: [
        "Online and Mail Order Retail",
        "Online Audio and Video Media",
        "Online Media",
      ],
      Outsourcing: [
        "Outsourcing and Offshoring Consulting",
        "Outsourcing/Offshoring",
      ],
      Packaging: [
        "Package/Freight Delivery",
        "Packaging and Containers",
        "Packaging and Containers Manufacturing",
      ],
      PaperAndForest: [
        "Paper & Forest Products",
        "Paper and Forest Product Manufacturing",
      ],
      PerformingArts: [
        "Performing Arts",
        "Performing Arts and Spectator Sports",
      ],
      PeriodicalPublishing: ["Periodical Publishing"],
      Pharmaceuticals: [
        "Alternative Medicine",
        "Medical and Diagnostic Laboratories",
        "Medical Devices",
        "Medical Equipment Manufacturing",
        "Medical Practice",
        "Medical Practices",
        "Pharmaceutical Manufacturing",
        "Pharmaceuticals",
      ],
      Philanthropy: ["Philanthropic Fundraising Services", "Philanthropy"],
      Photography: ["Photography"],
      Political: ["Political Organization", "Political Organizations"],
      PrintingServices: ["Printing", "Printing Services"],
      ProgramDevelopment: ["Program Development"],
      Public: [
        "Public Health",
        "Public Policy",
        "Public Policy Offices",
        "Public Relations and Communications",
        "Public Relations and Communications Services",
        "Public Safety",
      ],
      Publishing: ["Publishing"],
      RailroadAndTransport: [
        "Rail Transportation",
        "Railroad Equipment Manufacturing",
        "Railroad Manufacture",
      ],
      Ranching: ["Ranching"],
      RealEstate: ["Real Estate", "Real Estate Agents and Brokers"],
      RecreationalFacilities: [
        "Recreational Facilities",
        "Recreational Facilities and Services",
      ],
      ReligiousInstitutions: ["Religious Institutions"],
      Renewable: [
        "Renewable Energy Semiconductor Manufacturing",
        "Renewable",
        "Renewables & Environment",
      ],
      ResearchServices: ["Research", "Research Services"],
      Restaurants: ["Restaurants"],
      Retail: [
        "Retail",
        "Retail Apparel and Fashion",
        "Retail Art Supplies",
        "Retail Groceries",
        "Retail Health and Personal Care Products",
        "Retail Luxury Goods and Jewelry",
        "Retail Motor Vehicles",
        "Retail Office Equipment",
        "Retail Recyclable Materials & Used Merchandise",
      ],
      Security: [
        "Security and Investigations",
        "Security Systems Services",
        "Security",
      ],
      Shipbuilding: ["Shipbuilding"],
      SocialNetworkingPlatforms: ["Social Networking Platforms"],
      SpaceResearchAndTechnology: ["Space Research and Technology"],
      Sports: [
        "Spectator Sports",
        "Sporting Goods",
        "Sporting Goods Manufacturing",
        "Sports",
        "Sports and Recreation Instruction",
      ],
      StaffingAndRecruiting: ["Staffing and Recruiting"],
      StrategicManagementServices: ["Strategic Management Services"],
      Supermarkets: ["Supermarkets"],
      TechnicalAndVocationalTraining: ["Technical and Vocational Training"],
      Telecommunications: ["Telecommunications"],
      Tobacco: ["Tobacco", "Tobacco Manufacturing"],
      TranslationAndLocalization: [
        "Translation and Localization",
        "Transportation",
        "Freight and Package Transportation",
        "Logistics and Supply Chain",
        "Transportation Equipment Manufacturing",
        "Transportation Programs",
        "Transportation",
        "Logistics and Storage",
        "Transportation/Trucking/Railroad",
        "Travel Arrangements",
        "Truck Transportation",
      ],
      Utilities: ["Utilities", "Utility System Construction"],
      VehicleRepairAndMaintenance: ["Vehicle Repair and Maintenance"],
      VentureCapital: [
        "Venture Capital & Private Equity",
        "Venture Capital and Private Equity Principals",
      ],
      VeterinaryServices: ["Veterinary", "Veterinary Services"],
      Warehousing: ["Warehousing", "Warehousing and Storage"],
      WellnessAndFitnessServices: ["Wellness and Fitness Services"],
      Wholesale: [
        "Wholesale",
        "Wholesale Building Materials",
        "Wholesale Computer Equipment",
        "Wholesale Import and Export",
      ],
      WineAndSpirits: ["Wine and Spirits"],
      WirelessServices: ["Wireless", "Wireless Services"],
      WritingAndEditing: ["Writing and Editing"],
      FinancialServices: ["Financial Services"],
      Insurance: ["Insurance"],
      AppliancesElectricalAndElectronicsManufacturing: [
        "Appliances, Electrical, and Electronics Manufacturing",
      ],
      InternationalTradeAndDevelopment: ["International Trade and Development"],
      Manufacturing: [
        "Audio and Video Equipment Manufacturing",
        "Beverage Manufacturing",
        "Chemical Manufacturing",
        "Chemicals",
        "Industrial Machinery Manufacturing",
        "Manufacturing",
        "Personal Care Product Manufacturing",
        "Plastics",
        "Plastics Manufacturing",
        "Semiconductor Manufacturing",
        "Semiconductors",
        "Textile Manufacturing",
        "Textiles",
      ],
      ThinkTanks: ["Think Tanks"],
      BookAndPeriodicalPublishing: ["Book and Periodical Publishing"],
      CapitalMarkets: ["Capital Markets"],
      ManagementConsulting: ["Management Consulting"],
      EventsServices: ["Events Services"],
      FacilitiesServices: ["Facilities Services"],
      ApparelFashion: ["Apparel & Fashion"],
      CommercialRealEstate: ["Commercial Real Estate"],
      GraphicDesign: ["Graphic Design"],
      BuildingMaterials: ["Building Materials"],
      IndustrialAutomation: ["Industrial Automation"],
      InternationalAffairs: ["International Affairs"],
      ImportAndExport: ["Import and Export"],
      Artists: ["Artists and Writers", "Arts and Crafts"],
      Libraries: ["Libraries"],
      LuxuryGoodsJewelry: ["Luxury Goods & Jewelry"],
      FineArt: ["Fine Art"],
      Cosmetics: ["Cosmetics"],
      AlternativeDisputeResolution: ["Alternative Dispute Resolution"],
      DataInfrastructureAndAnalytics: ["Data Infrastructure and Analytics"],
      Blogs: ["Blogs"],
      FireProtection: ["Fire Protection"],
      IndustryAssociations: ["Industry Associations"],
      GolfCoursesAndCountryClubs: ["Golf Courses and Country Clubs"],
      AirWaterAndWasteProgramManagement: [
        "Air, Water, and Waste Program Management",
      ],
      CommunityDevelopmentAndUrbanPlanning: [
        "Community Development and Urban Planning",
      ],
      HydroelectricPowerGeneration: ["Hydroelectric Power Generation"],
      LanguageSchools: ["Language Schools"],
    };

    const industryCounts = await Local.aggregate([
      {
        $match: {
          industries: {
            $in: [].concat(...Object.values(industryMappings)),
          },
        },
      },
      {
        $unwind: "$industries",
      },
      {
        $group: {
          _id: "$industries",
          count: { $sum: 1 },
        },
      },
    ]).exec();

    const result = {
      total: 0,
    };

    industryCounts.forEach(({ _id, count }) => {
      const industryCategory = Object.keys(industryMappings).find((key) =>
        industryMappings[key].includes(_id)
      );
      if (industryCategory) {
        if (!result[industryCategory]) {
          result[industryCategory] = 0;
        }
        result[industryCategory] += count;
        // result.total += count;
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};


const industries = {
  Accounting: ["Accounting"],
  Administration: ["Administration of Justice"],
  Advertising: ["Advertising Services", "Advertising"],
  AirlinesAndAviation: [
    "Airlines and Aviation",
    "Airlines/Aviation",
    "Aviation & Aerospace",
  ],
  Animation: ["Animation", "Animation and Post-production"],
  ArchitectureAndPlanning: [
    "Architecture and Planning",
    "Architecture & Planning",
  ],
  ArmedForces: ["Armed Forces"],
  Automation: [
    "Automation",
    "Automotive",
    "Automation Machinery Manufacturing",
  ],
  Banking: ["Banking"],
  Biotechnology: ["Biotechnology", "Biotechnology Research"],
  BroadcastMedia: [
    "Broadcast Media",
    "Broadcast",
    "Broadcast Media Production and Distribution",
  ],
  Business: [
    "Business",
    "Business Consulting and Services",
    "Business Intelligence Platforms",
    "Business Skills Training",
    "Business Supplies and Equipment",
  ],
  Civil: [
    "Civic & Social Organization",
    "Civic and Social Organizations",
    "Civil Engineering",
  ],
  Computer: [
    "Computer & Network Security",
    "Computer and Network Security",
    "Computer Games",
    "Computer Hardware",
    "Computer Hardware Manufacturing",
    "Computer Networking",
    "Computer Networking Products",
    "Computer Software",
    "Computers and Electronics Manufacturing",
  ],
  Construction: ["Residential Building Construction", "Construction"],
  Consumer: ["Consumer Electronics", "Consumer Goods", "Consumer Services"],
  Dairy: ["Dairy", "Dairy Product Manufacturing"],
  DefenseAndSpace: ["Defense & Space", "Defense and Space Manufacturing"],
  Design: ["Design Services", "Design"],
  Education: [
    "Education",
    "Education Administration Programs",
    "Education Management",
    "E-Learning",
    "E-Learning Providers",
    "Higher Education",
    "Primary and Secondary Education",
    "Primary/Secondary Education",
  ],
  ProfessionalServices: [
    "Professional Services",
    "Professional Training & Coaching",
  ],
  Electric: [
    "Electric Power Generation",
    "Electric Power Transmission",
    "Control, and Distribution",
    "Electrical/Electronic Manufacturing",
  ],
  Entertainment: ["Entertainment", "Entertainment Providers"],
  Environment: ["Environmental Quality Programs", "Environmental Services"],
  ExecutiveOffice: ["Executive Office", "Executive Offices"],
  Farming: ["Farming", "Ranching", "Forestry"],
  Fishery: ["Fisheries", "Fishery"],
  Food: [
    "Food & Beverages",
    "Food",
    "Food and Beverage Manufacturing",
    "Food and Beverage Services",
    "Food Production",
  ],
  Fund: ["Fundraising", "Fund", "Fund-Raising"],
  Furniture: ["Furniture", "Furniture and Home Furnishings Manufacturing"],
  GamblingAndCasinos: [
    "Gambling & Casinos",
    "Gambling and Casinos",
    "Gambling Facilities and Casinos",
  ],
  GlassCeramicsAndConcrete: [
    "Glass, Ceramics & Concrete",
    "Glass",
    "Ceramics and Concrete Manufacturing",
  ],
  Government: [
    "Government Administration",
    "Government Relations",
    "Government Relations Services",
  ],
  HealthAndFitness: [
    "Health and Fitness",
    "Health and Human Services",
    "Health, Wellness and Fitness",
  ],
  Hospitality: [
    "Hospital & Health Care",
    "Hospitality",
    "Hospitals and Health Care",
  ],
  HumanResources: ["Human Resources", "Human Resources Services"],
  IndividualAndFamilyServices: [
    "Individual & Family Services",
    "Individual and Family Services",
  ],
  Internet: [
    "Internet",
    "Internet Marketplace Platforms",
    "Internet News",
    "Internet Publishing",
  ],
  Investment: ["Investment Banking", "Investment Management"],
  ITServices: [
    "Desktop Computing Software Products",
    "Embedded Software Products",
    "Information Services",
    "Information Technology and Services",
    "IT Services and IT Consulting",
    "IT System Design Services",
    "Software Development",
    "Technology and Information Technology",
    "Information and Media",
  ],
  Law: ["Law Enforcement", "Law Practice"],
  Leasing: ["Leasing Non-residential Real Estate", "Leasing Real Estate"],
  LegalServices: ["Legal Services"],
  LegislativeOffices: ["Legislative Offices"],
  LeisureTravelAndTourism: ["Leisure, Travel & Tourism"],
  Machinery: ["Machinery", "Machinery Manufacturing"],
  Maritime: ["Maritime", "Maritime Transportation"],
  MarketResearch: ["Market Research"],
  Marketing: ["Marketing and Advertising", "Marketing Services"],
  Mechanical: ["Mechanical or Industrial Engineering", "Mechanical"],
  Media: ["Media Production"],
  MentalHealthCare: ["Mental Health Care"],
  MetalTreatments: ["Metal Treatments"],
  Military: ["Military"],
  Mining: ["Mining", "Mining & Metals"],
  Mobile: [
    "Mobile Computing Software Products",
    "Mobile Gaming Apps",
    "Mobile",
  ],
  MotionPicturesAndFilm: ["Motion Pictures and Film"],
  MotorVehicle: [
    "Motor Vehicle Manufacturing",
    "Motor Vehicle",
    "Motor Vehicle Parts Manufacturing",
  ],
  MoviesAndSoundRecording: ["Movies and Sound Recording"],
  MueseumAndZoos: [
    "Museums and Institutions",
    "Museums, Historical Sites, and Zoos",
  ],
  Music: ["Music", "Musicians"],
  Nanotechnology: ["Nanotechnology", "Nanotechnology Research"],
  Newspaper: ["Newspaper Publishing", "Newspapers"],
  NonprofitOrganizations: [
    "Nonprofit Organization Management",
    "Non-profit Organizations",
  ],
  OilAndGas: ["Oil & Energy", "Oil and Gas"],
  Online: [
    "Online and Mail Order Retail",
    "Online Audio and Video Media",
    "Online Media",
  ],
  Outsourcing: [
    "Outsourcing and Offshoring Consulting",
    "Outsourcing/Offshoring",
  ],
  Packaging: [
    "Package/Freight Delivery",
    "Packaging and Containers",
    "Packaging and Containers Manufacturing",
  ],
  PaperAndForest: [
    "Paper & Forest Products",
    "Paper and Forest Product Manufacturing",
  ],
  PerformingArts: ["Performing Arts", "Performing Arts and Spectator Sports"],
  PeriodicalPublishing: ["Periodical Publishing"],
  Pharmaceuticals: [
    "Alternative Medicine",
    "Medical and Diagnostic Laboratories",
    "Medical Devices",
    "Medical Equipment Manufacturing",
    "Medical Practice",
    "Medical Practices",
    "Pharmaceutical Manufacturing",
    "Pharmaceuticals",
  ],
  Philanthropy: ["Philanthropic Fundraising Services", "Philanthropy"],
  Photography: ["Photography"],
  Political: ["Political Organization", "Political Organizations"],
  PrintingServices: ["Printing", "Printing Services"],
  ProgramDevelopment: ["Program Development"],
  Public: [
    "Public Health",
    "Public Policy",
    "Public Policy Offices",
    "Public Relations and Communications",
    "Public Relations and Communications Services",
    "Public Safety",
  ],
  Publishing: ["Publishing"],
  RailroadAndTransport: [
    "Rail Transportation",
    "Railroad Equipment Manufacturing",
    "Railroad Manufacture",
  ],
  Ranching: ["Ranching"],
  RealEstate: ["Real Estate", "Real Estate Agents and Brokers"],
  RecreationalFacilities: [
    "Recreational Facilities",
    "Recreational Facilities and Services",
  ],
  ReligiousInstitutions: ["Religious Institutions"],
  Renewable: [
    "Renewable Energy Semiconductor Manufacturing",
    "Renewable",
    "Renewables & Environment",
  ],
  ResearchServices: ["Research", "Research Services"],
  Restaurants: ["Restaurants"],
  Retail: [
    "Retail",
    "Retail Apparel and Fashion",
    "Retail Art Supplies",
    "Retail Groceries",
    "Retail Health and Personal Care Products",
    "Retail Luxury Goods and Jewelry",
    "Retail Motor Vehicles",
    "Retail Office Equipment",
    "Retail Recyclable Materials & Used Merchandise",
  ],
  Security: [
    "Security and Investigations",
    "Security Systems Services",
    "Security",
  ],
  Shipbuilding: ["Shipbuilding"],
  SocialNetworkingPlatforms: ["Social Networking Platforms"],
  SpaceResearchAndTechnology: ["Space Research and Technology"],
  Sports: [
    "Spectator Sports",
    "Sporting Goods",
    "Sporting Goods Manufacturing",
    "Sports",
    "Sports and Recreation Instruction",
  ],
  StaffingAndRecruiting: ["Staffing and Recruiting"],
  StrategicManagementServices: ["Strategic Management Services"],
  Supermarkets: ["Supermarkets"],
  TechnicalAndVocationalTraining: ["Technical and Vocational Training"],
  Telecommunications: ["Telecommunications"],
  Tobacco: ["Tobacco", "Tobacco Manufacturing"],
  TranslationAndLocalization: [
    "Translation and Localization",
    "Transportation",
    "Freight and Package Transportation",
    "Logistics and Supply Chain",
    "Transportation Equipment Manufacturing",
    "Transportation Programs",
    "Transportation",
    "Logistics and Storage",
    "Transportation/Trucking/Railroad",
    "Travel Arrangements",
    "Truck Transportation",
  ],
  Utilities: ["Utilities", "Utility System Construction"],
  VehicleRepairAndMaintenance: ["Vehicle Repair and Maintenance"],
  VentureCapital: [
    "Venture Capital & Private Equity",
    "Venture Capital and Private Equity Principals",
  ],
  VeterinaryServices: ["Veterinary", "Veterinary Services"],
  Warehousing: ["Warehousing", "Warehousing and Storage"],
  WellnessAndFitnessServices: ["Wellness and Fitness Services"],
  Wholesale: [
    "Wholesale",
    "Wholesale Building Materials",
    "Wholesale Computer Equipment",
    "Wholesale Import and Export",
  ],
  WineAndSpirits: ["Wine and Spirits"],
  WirelessServices: ["Wireless", "Wireless Services"],
  WritingAndEditing: ["Writing and Editing"],
  FinancialServices: ["Financial Services"],
  Insurance: ["Insurance"],
  AppliancesElectricalAndElectronicsManufacturing: [
    "Appliances, Electrical, and Electronics Manufacturing",
  ],
  InternationalTradeAndDevelopment: ["International Trade and Development"],
  Manufacturing: [
    "Audio and Video Equipment Manufacturing",
    "Beverage Manufacturing",
    "Chemical Manufacturing",
    "Chemicals",
    "Industrial Machinery Manufacturing",
    "Manufacturing",
    "Personal Care Product Manufacturing",
    "Plastics",
    "Plastics Manufacturing",
    "Semiconductor Manufacturing",
    "Semiconductors",
    "Textile Manufacturing",
    "Textiles",
  ],
  ThinkTanks: ["Think Tanks"],
  BookAndPeriodicalPublishing: ["Book and Periodical Publishing"],
  CapitalMarkets: ["Capital Markets"],
  ManagementConsulting: ["Management Consulting"],
  EventsServices: ["Events Services"],
  FacilitiesServices: ["Facilities Services"],
  ApparelFashion: ["Apparel & Fashion"],
  CommercialRealEstate: ["Commercial Real Estate"],
  GraphicDesign: ["Graphic Design"],
  BuildingMaterials: ["Building Materials"],
  IndustrialAutomation: ["Industrial Automation"],
  InternationalAffairs: ["International Affairs"],
  ImportAndExport: ["Import and Export"],
  Artists: ["Artists and Writers", "Arts and Crafts"],
  Libraries: ["Libraries"],
  LuxuryGoodsJewelry: ["Luxury Goods & Jewelry"],
  FineArt: ["Fine Art"],
  Cosmetics: ["Cosmetics"],
  AlternativeDisputeResolution: ["Alternative Dispute Resolution"],
  DataInfrastructureAndAnalytics: ["Data Infrastructure and Analytics"],
  Blogs: ["Blogs"],
  FireProtection: ["Fire Protection"],
  IndustryAssociations: ["Industry Associations"],
  GolfCoursesAndCountryClubs: ["Golf Courses and Country Clubs"],
  AirWaterAndWasteProgramManagement: [
    "Air, Water, and Waste Program Management",
  ],
  CommunityDevelopmentAndUrbanPlanning: [
    "Community Development and Urban Planning",
  ],
  HydroelectricPowerGeneration: ["Hydroelectric Power Generation"],
  LanguageSchools: ["Language Schools"],
};

//Aggregation
// const searchByDepartmentAndJobTitle = async (req, res) => {
//   try {
//     const {
//       department,
//       jobTitle,
//       start,
//       length,
//       sortField,
//       sortOrder,
//       searchByCompanyAndEmail,
//       search,
//       searchByCountry,
//       continent,
//     } = req.body;

//     const pipeline = [];

//     // Apply additional filters for 'jobTitle'
//     if (Array.isArray(jobTitle) && jobTitle.length > 0) {
//       pipeline.push({
//         $match: {
//           jobTitle: { $in: jobTitle.map((title) => new RegExp(title, "i")) },
//         },
//       });
//     }

//     // Apply filter for 'continent' using continentsToCountries
//     if (continent && continent.length > 0) {
//       const continentFilters = continent.map((c) => ({
//         prospectLocation: { $in: continentsToCountries[c] || [] },
//       }));
//       pipeline.push({ $match: { $or: continentFilters } });
//     }

//     if (searchByCountry) {
//       pipeline.push({
//         $match: {
//           prospectLocation: { $regex: new RegExp(searchByCountry + "$", "i") },
//         },
//       });
//     }

//     // Apply search by company and email if specified
//     if (searchByCompanyAndEmail) {
//       const companyEmailMatch = {
//         $or: [
//           { email: { $regex: new RegExp(searchByCompanyAndEmail, "i") } },
//           { companyName: { $regex: new RegExp(searchByCompanyAndEmail, "i") } },
//         ],
//       };
//       pipeline.push({ $match: companyEmailMatch });
//     }

//     // Apply search if specified
//     if (search) {
//       pipeline.push({
//         $match: {
//           fullName: { $regex: new RegExp(search, "i") },
//         },
//       });
//     }

//     pipeline.push({
//       $project: {
//         _id: 0, // Exclude the _id field
//         fullName: 1, // Include the fullName field
//         jobTitle: 1, // Include the jobTitle field
//         // department: 0, // Include the department field
//         // prospectLocation: 0, // Include the prospectLocation field
//         // email: 0, // Include the email field
//         companyName: 1, // Include the companyName field
//         // Add or remove fields as needed
//       },
//     });

//     // Handle 'department' filter
//     if (Array.isArray(department) && department.length > 0) {
//       pipeline.push({
//         $match: {
//           department: { $in: department.map((dept) => new RegExp(dept, "i")) },
//         },
//       });
//     }

//     // Sorting
//     if (sortField) {
//       const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 };
//       pipeline.push({ $sort: sort });
//     }

//     // Pagination
//     pipeline.push({ $skip: start });
//     pipeline.push({ $limit: length });

//     // Execute the aggregation pipeline
//     const data = await Employee.aggregate(pipeline).count();

//     // Calculate the total count based on the matching criteria
//     const countPipeline = pipeline.slice(0, -2); // Remove skip and limit stages
//     const count = await Employee.aggregate([
//       ...countPipeline,
//       { $count: "count" },
//     ]);
//     const totalRecords = count.length > 0 ? count[0].count : 0;

//     // Calculate the total pages and filtered pages
//     const totalPage = Math.ceil(totalRecords / length);
//     const filteredPages = Math.ceil(data.length / length);

//     // const result = {
//     //   recordsTotal: totalRecords,
//     //   recordsFiltered: data.length,
//     //   totalPages: totalPage,
//     //   currentPage: filteredPages,
//     //   recordsPerPage: length,
//     //   data: data,
//     // };

//     res.status(200).json({
//       totalRecords,
//       totalPage,
//       filteredRecords: data.length,
//       filteredPages,
//       data,
//     });

//     // res.status(200).json(result);
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).json({
//       status: 500,
//       error: "500",
//       message: "Internal Server Error",
//     });
//   }
// };

//Original
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
    "Tanzania",
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
    "Meinerzhagen, North Rhine-westphalia, Germany",
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
    // "France",
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
    // "Norway",
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
    // "United Kingdom",
    // "United Kingdom of Great Britain and Northern Ireland",
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
    // "Argentina",
    "Bolivia (Plurinational State of)",
    "Bouvet Island",
    "Brazil",
    // "Chile",
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
  Antarctica: [
    "France",
    "United Kingdom",
    "New Zealand",
    "Norway",
    "Australia",
    "Chile",
    "Argentina",
  ],
  Oceania: [
    "Fiji",
    "Kiribati",
    "Marshall Islands",
    "Micronesia",
    "Nauru",
    "Palau",
    "Papua New Guinea",
    "Samoa",
    "Solomon Islands",
    "Tonga",
    "Tuvalu",
    "Vanuatu",
  ],
};

const countriesByRegion = {
  APAC: [
    "Afghanistan",
    "Australia",
    "Bangladesh",
    "Bhutan",
    "Burma",
    "Brunei",
    "Cambodia",
    "China (including special administrative regions of Hong Kong and Macau)",
    "Cook Islands",
    "Federated States of Micronesia",
    "Fiji",
    "India",
    "Indonesia",
    "Japan",
    "Kiribati",
    "Laos",
    "Malaysia",
    "Maldives",
    "Marshall Islands",
    "Mongolia",
    "Nepal",
    "New Caledonia",
    "New Zealand",
    "Niue",
    "North Korea",
    "Pakistan",
    "Palau",
    "Papua New Guinea",
    "Philippines",
    "Singapore",
    "Solomon Islands",
    "South Korea",
    "Sri Lanka",
    "Taiwan",
    "Thailand",
    "Timor-Leste",
    "Tonga",
    "Tuvalu",
    "Vanuatu",
    "Vietnam",
  ],
  Caribbean: [
    "Anguilla",
    "Antigua and Barbuda",
    "Aruba",
    "Bahamas",
    "Barbados",
    "Belize",
    "Bermuda",
    "Bonaire, Sint Eustatius, and Saba",
    "British Virgin Islands",
    "Cayman Islands",
    "Cuba",
    "Curaçao",
    "Dominica",
    "Dominican Republic",
    "Grenada",
    "Guadeloupe",
    "Haiti",
    "Jamaica",
    "Martinique",
    "Montserrat",
    "Puerto Rico",
    "Saint Barthélemy",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin",
    "Saint Vincent and the Grenadines",
    "Sint Maarten",
    "Trinidad and Tobago",
    "Turks and Caicos Islands",
    "United States Virgin Islands",
  ],
  LatinAmerica: [
    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Ecuador",
    "Falkland Islands",
    "French Guiana",
    "Guyana",
    "Paraguay",
    "Peru",
    "South Georgia and the South Sandwich Islands",
    "Suriname",
    "Uruguay",
    "Venezuela",
  ],
  MiddleEast: [
    "Bahrain",
    "Iran",
    "Iraq",
    "Israel",
    "Jordan",
    "Kuwait",
    "Lebanon",
    "Oman",
    "Palestine",
    "Qatar",
    "Saudi Arabia",
    "Syria",
    "Turkey",
    "United Arab Emirates",
    "Yemen",
  ],
  EMEA: [
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Austria",
    "Bahrain",
    "Belarus",
    "Belgium",
    "Benin",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cameroon",
    "Cape Verde",
    "Central African Republic",
    "Chad",
    "Comoros",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Egypt",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Faroe Islands",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Hungary",
    "Iceland",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle Of Man",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jersey",
    "Jordan",
    "Kenya",
    "Kuwait",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Mali",
    "Malta",
    "Mauritania",
    "Mauritius",
    "Moldova",
    "Monaco",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Netherlands",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Palestine",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Rwanda",
    "San Marino",
    "Sao Tome & Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Somalia",
    "South Africa",
    "Spain",
    "Sudan",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tanzania",
    "Togo",
    "Tunisia",
    "Turkey",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "Vatican City",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ],
};

const countries = {
  Australia: "Australia",
  Afghanistan: "Afghanistan",
  Benin: "Benin",
  BurkinaFaso: "Burkina Faso",
  Burundi: "Burundi",
  CapeVerde: "Cape Verde",
  Cameroon: "Cameroon",
  CentralAfricanRepublic: "Central African Republic",
  Chad: "Chad",
  Comoros: "Comoros",
  DemocraticRepublicoftheCongo: "Democratic Republic of the Congo",
  Djibouti: "Djibouti",
  Egypt: "Egypt",
  EquatorialGuinea: "Equatorial Guinea",
  Eritrea: "Eritrea",
  Eswatini: "Eswatini",
  Ethiopia: "Ethiopia",
  Gabon: "Gabon",
  Gambia: "Gambia",
  Ghana: "Ghana",
  Guinea: "Guinea",
  GuineaBissau: "Guinea Bissau",
  IvoryCoast: "Ivory Coast",
  Kenya: "Kenya",
  Lesotho: "Lesotho",
  Liberia: "Liberia",
  Libya: "Libya",
  Madagascar: "Madagascar",
  Malawi: "Malawi",
  Mali: "Mali",
  Mauritania: "Mauritania",
  Mauritius: "Mauritius",
  Mayotte: "Mayotte",
  Morocco: "Morocco",
  Mozambique: "Mozambique",
  Namibia: "Namibia",
  Niger: "Niger",
  Nigeria: "Nigeria",
  Reunion: "Reunion",
  Rwanda: "Rwanda",
  SaintHelena: "Saint Helena",
  SaoTomeandPrincipe: "Sao Tome and Principe",
  Senegal: "Senegal",
  Seychelles: "Seychelles",
  SierraLeone: "Sierra Leone",
  Somalia: "Somalia",
  SouthAfrica: "South Africa",
  SouthSudan: "South Sudan",
  Sudan: "Sudan",
  Tanzania: "Tanzania",
  Togo: "Togo",
  Tunisia: "Tunisia",
  Uganda: "Uganda",
  WesternSahara: "Western Sahara",
  Zambia: "Zambia",
  Zimbabwe: "Zimbabwe",
  Azerbaijan: "Azerbaijan",
  Bahrain: "Bahrain",
  Bangladesh: "Bangladesh",
  Bhutan: "Bhutan",
  Brunei: "Brunei",
  Cambodia: "Cambodia",
  PeoplesRepublicOfChina: "People's Republic Of China",
  Cyprus: "Cyprus",
  Georgia: "Georgia",
  HongKong: "Hong Kong",
  India: "India",
  Indonesia: "Indonesia",
  Iran: "Iran",
  Iraq: "Iraq",
  Israel: "Israel",
  Japan: "Japan",
  Jordan: "Jordan",
  Kazakhstan: "Kazakhstan",
  NorthKorea: "North Korea",
  SouthKorea: "South Korea",
  Kuwait: "Kuwait",
  Kyrgyzstan: "Kyrgyzstan",
  Laos: "Laos",
  Lebanon: "Lebanon",
  Macau: "Macau",
  Malaysia: "Malaysia",
  Maldives: "Maldives",
  Mongolia: "Mongolia",
  Myanmar: "Myanmar",
  Nepal: "Nepal",
  Oman: "Oman",
  Pakistan: "Pakistan",
  Palestine: "Palestine",
  Philippines: "Philippines",
  Qatar: "Qatar",
  SaudiArabia: "Saudi Arabia",
  Singapore: "Singapore",
  SriLanka: "Sri Lanka",
  Syria: "Syria",
  Taiwan: "Taiwan",
  Tajikistan: "Tajikistan",
  Thailand: "Thailand",
  TimorLeste: "Timor Leste",
  Turkey: "Turkey",
  Turkmenistan: "Turkmenistan",
  UnitedArabEmirates: "United Arab Emirates",
  Uzbekistan: "Uzbekistan",
  Vietnam: "Vietnam",
  Yemen: "Yemen",
  AmericanSamoa: "American Samoa",
  ChristmasIsland: "Christmas Island",
  CocosIslands: "Cocos Islands",
  CookIslands: "Cook Islands",
  Fiji: "Fiji",
  FrenchPolynesia: "French Polynesia",
  Guam: "Guam",
  HeardIslandAndMcDonaldIslands: "Heard Island And McDonald Islands",
  Kiribati: "Kiribati",
  MarshallIslands: "Marshall Islands",
  Micronesia: "Micronesia",
  Nauru: "Nauru",
  NewCaledonia: "New Caledonia",
  NewZealand: "New Zealand",
  Niue: "Niue",
  NorfolkIsland: "Norfolk Island",
  NorthernMarianaIslands: "Northern Mariana Islands",
  Palau: "Palau",
  PapuaNewGuinea: "Papua New Guinea",
  PitcairnIslands: "Pitcairn Islands",
  Samoa: "Samoa",
  SolomonIslands: "Solomon Islands",
  Tokelau: "Tokelau",
  Tonga: "Tonga",
  Tuvalu: "Tuvalu",
  Vanuatu: "Vanuatu",
  WallisAndFutuna: "Wallis And Futuna",
  AlandIslands: "Aland Islands",
  Albania: "Albania",
  Andorra: "Andorra",
  Austria: "Austria",
  Belarus: "Belarus",
  Belgium: "Belgium",
  BosniaAndHerzegovina: "Bosnia And Herzegovina",
  Bulgaria: "Bulgaria",
  Croatia: "Croatia",
  CzechRepublic: "Czech Republic",
  Denmark: "Denmark",
  Estonia: "Estonia",
  FaroeIslands: "Faroe Islands",
  Finland: "Finland",
  France: "France",
  Germany: "Germany",
  Gibraltar: "Gibraltar",
  Greece: "Greece",
  Guernsey: "Guernsey",
  VaticanCity: "Vatican City",
  Hungary: "Hungary",
  Iceland: "Iceland",
  Ireland: "Ireland",
  IsleOfMan: "Isle Of Man",
  Italy: "Italy",
  Jersey: "Jersey",
  Latvia: "Latvia",
  Liechtenstein: "Liechtenstein",
  Lithuania: "Lithuania",
  Luxembourg: "Luxembourg",
  Malta: "Malta",
  Moldova: "Moldova",
  Monaco: "Monaco",
  Montenegro: "Montenegro",
  Netherlands: "Netherlands",
  NorthMacedonia: "North Macedonia",
  Norway: "Norway",
  Poland: "Poland",
  Portugal: "Portugal",
  Romania: "Romania",
  Russia: "Russia",
  SanMarino: "San Marino",
  Serbia: "Serbia",
  Slovakia: "Slovakia",
  Slovenia: "Slovenia",
  Spain: "Spain",
  SvalbardAndJanMayen: "Svalbard And Jan Mayen",
  Sweden: "Sweden",
  Switzerland: "Switzerland",
  Ukraine: "Ukraine",
  UnitedKingdom: "United Kingdom",
  Belize: "Belize",
  Bermuda: "Bermuda",
  Canada: "Canada",
  CostaRica: "Costa Rica",
  ElSalvador: "El Salvador",
  Greenland: "Greenland",
  Guatemala: "Guatemala",
  Honduras: "Honduras",
  Mexico: "Mexico",
  Nicaragua: "Nicaragua",
  Panama: "Panama",
  SaintPierreAndMiquelon: "Saint Pierre And Miquelon",
  UnitedStates: "United States",
  Anguilla: "Anguilla",
  Armenia: "Armenia",
  AntiguaAndBarbuda: "Antigua And Barbuda",
  Argentina: "Argentina",
  Aruba: "Aruba",
  Bahamas: "Bahamas",
  Barbados: "Barbados",
  Bolivia: "Bolivia",
  BonaireSintEustatiusAndSaba: "Bonaire Sint Eustatius And Saba",
  BouvetIsland: "Bouvet Island",
  Brazil: "Brazil",
  CaymanIslands: "Cayman Islands",
  Chile: "Chile",
  Colombia: "Colombia",
  Cuba: "Cuba",
  Curaçao: "Curaçao",
  Dominica: "Dominica",
  DominicanRepublic: "Dominican Republic",
  Ecuador: "Ecuador",
  FalklandIslands: "Falkland Islands",
  FrenchGuiana: "French Guiana",
  Grenada: "Grenada",
  Guadeloupe: "Guadeloupe",
  Guam: "Guam",
  Guyana: "Guyana",
  Haiti: "Haiti",
  Jamaica: "Jamaica",
  Martinique: "Martinique",
  Montserrat: "Montserrat",
  Paraguay: "Paraguay",
  Peru: "Peru",
  PuertoRico: "Puerto Rico",
  SaintBarthélemy: "Saint Barthélemy",
  SaintKittsAndNevis: "Saint Kitts And Nevis",
  SaintLucia: "Saint Lucia",
  SaintMartin: "Saint Martin",
  SaintVincentAndTheGrenadines: "Saint Vincent And The Grenadines",
  SintMaarten: "Sint Maarten",
  SouthGeorgiaAndTheSouthSandwichIslands:
    "South Georgia And The South Sandwich Islands",
  Suriname: "Suriname",
  TrinidadAndTobago: "Trinidad And Tobago",
  TurksAndCaicosIslands: "Turks And Caicos Islands",
  Uruguay: "Uruguay",
  Venezuela: "Venezuela",
  VirginIslands: "Virgin Islands",
};

//Experimental
// const searchByDepartmentAndJobTitle = async (req, res) => {
//   try {
//     const {
//       department,
//       jobTitle,
//       start,
//       length,
//       sortField,
//       sortOrder,
//       searchByCompanyAndEmail,
//       searchByWebsite,
//       search,
//       searchByCountry,
//       continent,
//       region,
//     } = req.body;

//     const filter = {};

//     // Apply additional filters for 'jobTitle'
//     if (Array.isArray(jobTitle) && jobTitle.length > 0) {
//       filter.jobTitle = {
//         $in: jobTitle.map((title) => new RegExp(title, "i")),
//       };
//     }

//     if (Array.isArray(searchByCountry) && searchByCountry.length > 0) {
//       const countriesToSearch = searchByCountry
//         .map((countryKey) => countries[countryKey])
//         .filter(Boolean);

//       if (countriesToSearch.length > 0) {
//         filter.country = { $in: countriesToSearch };
//       }
//     }

//     if (Array.isArray(continent) && continent.length > 0) {
//       const continentToSearch = continent
//         .map((continentKey) => continentsToCountries[continentKey] || [])
//         .flat()
//         .filter(Boolean);

//       if (continentToSearch.length > 0) {
//         filter.country = { $in: continentToSearch };
//       }
//     }

//     if (Array.isArray(region) && region.length > 0) {
//       const regionToSearch = region
//         .map((regionKey) => countriesByRegion[regionKey] || [])
//         .flat()
//         .filter(Boolean);

//       if (regionToSearch.length > 0) {
//         filter.country = { $in: regionToSearch };
//       }
//     }

//     // Apply search by company and email if specified
//     if (searchByCompanyAndEmail) {
//       filter.$or = [
//         ...(filter.$or || []),
//         { companyName: { $eq: searchByCompanyAndEmail } },
//       ];
//     }

//     // Apply search by website if specified
//     if (searchByWebsite) {
//       filter.$or = [
//         ...(filter.$or || []),
//         { website: { $eq: searchByWebsite } },
//       ];
//     }

//     // Apply search if specified
//     if (search) {
//       filter.fullName = { $regex: new RegExp(search, "i") };
//     }

//     // Handle 'department' filter
//     if (Array.isArray(department) && department.length > 0) {
//       filter.department = {
//         $in: department.map((dept) => new RegExp(dept, "i")),
//       };
//     }

//     // Sorting
//     const sort = sortField ? { [sortField]: sortOrder === "asc" ? 1 : -1 } : {};

//     if (Object.keys(filter).length === 0) {
//       res.status(200).json({ message: "Please select filters" });
//       return;
//     }

//     let data;
//     let totalRecords;
//     let totalPage;

//     if (searchByCompanyAndEmail) {
//       const companyData = await Employee.find(filter).limit(length);
//       const explain = await Employee.find(filter).explain();

//       if (companyData && companyData.length > 0) {
//         const accountData = await Local.find({
//           name: { $regex: new RegExp(companyData[0].companyName, "i") },
//         });

//         const count = await Employee.countDocuments(filter);

//         data = companyData.map((cm) => ({
//           fullName: cm.fullName,
//           jobTitle: cm.jobTitle,
//           company: accountData[0].name,
//           location: cm.prospectLocation,
//           company_size: accountData[0].company_size,
//           industry: accountData[0].industries,
//         }));

//         totalRecords = count;
//         totalPage = Math.ceil(totalRecords / length);
//       }
//     } else {
//       const countPromise = Employee.countDocuments(filter);
//       const dataPromise = Employee.find(filter).skip(start).limit(length);

//       const [count, resultData] = await Promise.all([
//         countPromise,
//         dataPromise,
//       ]);

//       if (resultData.length === 0) {
//         res
//           .status(404)
//           .json({ status: 404, error: "404", message: "Data Not Found" });
//         return;
//       }

//       totalRecords = count;
//       totalPage = Math.ceil(totalRecords / length);
//       data = resultData;
//     }

//     res.status(200).json({
//       totalRecords,
//       totalPage,
//       filteredRecords: data.length,
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

//Working
const searchByDepartmentAndJobTitle = async (req, res) => {
  try {
    const {
      department,
      jobTitle,
      start,
      length,
      sortField,
      sortOrder,
      searchByCompanyAndWebsite,
      company_size,
      search,
      industryAndSector,
      seniority,
      searchByCountry,
      continent,
      region,
    } = req.body;

    const filter = {};
    const companyFilter = {};

    // Apply additional filters for 'jobTitle'
    if (Array.isArray(jobTitle) && jobTitle.length > 0) {
      filter.jobTitle = {
        $in: jobTitle.map((title) => new RegExp(title, "i")),
      };
    }

    if (Array.isArray(searchByCountry) && searchByCountry.length > 0) {
      const countriesToSearch = searchByCountry
        .map((countryKey) => countries[countryKey])
        .filter(Boolean);

      console.log("countriesToSearch", countriesToSearch);
      if (countriesToSearch.length > 0) {
        // Use $in for exact match without regular expressions
        filter.country = { $in: countriesToSearch };
      }
    }

    if (Array.isArray(continent) && continent.length > 0) {
      console.log("continent", continent);
      const continentToSearch = continent
        .map((continentKey) => continentsToCountries[continentKey] || [])
        .flat()
        .filter(Boolean);

      console.log("continentToSearch", continentToSearch);

      if (continentToSearch.length > 0) {
        // Use $in for exact match without regular expressions
        filter.country = { $in: continentToSearch };
      }
    }

    if (Array.isArray(region) && region.length > 0) {
      console.log("region", region);
      const regionToSearch = region
        .map((regionKey) => countriesByRegion[regionKey] || [])
        .flat()
        .filter(Boolean);

      console.log("regionToSearch", regionToSearch);

      if (regionToSearch.length > 0) {
        // Use $in for exact match without regular expressions
        filter.country = { $in: regionToSearch };
      }
    }

//     if (
//       Array.isArray(searchByCompanyAndWebsite) &&
//       searchByCompanyAndWebsite.length > 0
//         )
//   {
//       console.log("At searchByCompanyAndWebsite Filter");
//       filter.$or = [
//         {
//           companyName: {
//             $in: searchByCompanyAndWebsite.map((name) => new RegExp(name, "i")),
//           },
//         },
//         {
//           websit: {
//             $in: searchByCompanyAndWebsite.map((name) => new RegExp(name, "i")),
//           },
//         },
//       ];
// }

if (Array.isArray(searchByCompanyAndWebsite) && searchByCompanyAndWebsite.length > 0) {
  // console.log("At searchByCompanyAndWebsite Filter");
  console.log('searchByCompanyAndWebsite', searchByCompanyAndWebsite)

  const data = await Local.find({_id:searchByCompanyAndWebsite});
  console.log('data', data)

  const companyNames = data.map((item) => item.name);

      // Use the company names in the $in operator for companyName
      filter.companyName = {
        $in: companyNames,
      };

  // filter._id = { $in: searchByCompanyAndWebsite };
}



    if (Array.isArray(company_size) && company_size.length > 0) {
      // Find documents in Local collection where company_size is in the given array
      console.log("At company_size filter");
      const data = await Local.find({
        company_size: { $in: company_size },
      }).limit(100000);

      // console.log("company_size data", data);

      // Extract the company names from the retrieved data
      const companyNames = data.map((item) => item.name);

      // Use the company names in the $in operator for companyName
      filter.companyName = {
        $in: companyNames,
      };
    }

    if (Array.isArray(industryAndSector) && industryAndSector.length > 0) {
      // Find documents in Local collection where company_size is in the given array
      const data = await Local.find({
        industries: { $in: industryAndSector },
      }).limit(10);

      console.log("Industries data", data);

      // Extract the company names from the retrieved data
      const companyNames = data.map((item) => item.name);

      // Use the company names in the $in operator for companyName
      filter.companyName = {
        $in: companyNames,
      };
    }

    // Apply search if specified
    if (search) {
      filter.fullName = { $regex: new RegExp(search, "i") };
    }

    // Handle 'department' filter
    if (Array.isArray(department) && department.length > 0) {
      filter.department = {
        $in: department.map((dept) => new RegExp(dept, "i")),
      };
    }

    if (Array.isArray(seniority) && seniority.length > 0) {
      filter.jobTitle = {
        $in: seniority.map((dept) => new RegExp(dept, "i")),
      };
    }

    // Sorting
    // const sort = sortField ? { [sortField]: sortOrder === "asc" ? 1 : -1 } : {};

    console.log("Filter++", filter);
    // console.log("company_size", company_size);

    if (Object.keys(filter).length === 0) {
      res.status(200).json({ message: "Please select filters" });
      return;
    }

    if (searchByCompanyAndWebsite.length > 0 || company_size.length > 0 || industryAndSector.length>0) {
      console.log("At searchByCompanyAndWebsite And company_size filter");
      const companyData = await Employee.find(filter).limit(length).skip(start);
      console.log("companyData", companyData);

      if (companyData && companyData.length > 0) {
        const companyNames = companyData.map((cm) => cm.companyName);

        console.log("Satge 2", companyNames);

        // Using $regex for case-insensitive exact match
        const accountData = await Local.find({
          name: {
            // $in: companyNames.map((name) => new RegExp(`^${name}$`, "i")),
            $in: companyNames,
          },
        }).limit(length)

        // console.log("accountData", accountData);

        const count = await Employee.countDocuments(filter);
        console.log("count if", count);

        const data = companyData.map((cm) => {
          const matchingAccount = accountData.find(
            (ad) => ad.name.toLowerCase() === cm.companyName.toLowerCase()
          );

          return {
            fullName: cm.fullName,
            jobTitle: cm.jobTitle,
            companyName: matchingAccount?.name || null,
            location: cm.prospectLocation,
            company_size: matchingAccount?.company_size || null,
            industry: matchingAccount?.industries || null,
          };
        });

        const totalRecords = count;
        const totalPage = Math.ceil(totalRecords / length);

        res.status(200).json({
          totalRecords,
          totalPage,
          filteredRecords: data.length,
          data,
        });
        return;
      }
    }

   
    const [count, data] = await Promise.all([
      Employee.countDocuments(filter),
      Employee.find(filter).skip(start).limit(length),
    ]);

    if (data.length === 0) {
      res
        .status(404)
        .json({ status: 404, error: "404", message: "Data Not Found" });
      return;
    }

    // Calculate the total count based on the matching criteria
    // const totalRecords = explanation.executionStats.nReturned;
    const totalRecords = count;

    // Calculate the total pages and filtered pages
    const totalPage = Math.ceil(totalRecords / length);

    res.status(200).json({
      totalRecords,
      totalPage,
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

const search = async (req, res) => {
  try {
    const { searchByCompanyAndEmail } = req.body;
    console.log('searchByCompanyAndEmail', searchByCompanyAndEmail)
    console.log("Stage 2");

    const data = await DCNAW.find({
      $or: [
        { name: { $regex: new RegExp("^" + searchByCompanyAndEmail, "i") } },
        { website: { $regex: new RegExp(searchByCompanyAndEmail, "i") } },
      ]
    }).limit(10);
    
   
    if (!data || data.length === 0) {
      res.status(404).json("Data Not found");
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.log("error", error);
    res.status(500).json("Internal Server Error");
  }
};

const distinctProst = async (req, res) => {
  try {
    const {
      department,
      start,
      length,
      sortField,
      sortOrder,
      searchByCompanyAndEmail,
      search,
      searchByCountry,
      continent,
    } = req.body;
    // const data = await Employee.find(
    //   {
    //     // prospectLocation: { $regex: new RegExp(searchByCountry, "i") },
    //     // department: { $regex: new RegExp(department, "i") },
    //     // jobTitle: jobTitle,
    //     continent: "europe",
    //   },
    //   null // Projection: null means return all fields
    // ).limit(10);
    // const data = await Employee.aggregate([{ $group: { _id: "$jobTitle" } }]);
    // const distinctJobTitles = data.map((item) => item._id);

    const query = {};
    query.country = "India";
    // if (industries) query.industries = industries;

    const data = await Employee.distinct({ query }).toArray();

    const cnt = await Employee.data;
    console.log("cnt", cnt);
    if (!data) {
      res.status(404).json("Data Not found");
      return;
    }

    if (data.length === 0) {
      res.status(404).json("Data Not found");
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.log("error", error);

    res.status(500).json("Internal Server Error");
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
  search,
  accountCount,
  distinctProst,
  chartForJobTitles,
  employeeFilter,
  searchByJobTitle,
  searchByDepartment,
  chartForIndustries,
  searchByDepartmentAndJobTitle,
  filterEmailAndCompanyName,
};
