const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId; // Import ObjectId
const Local = require("../model/data");
const asyncHandler = require("express-async-handler");

const getData = async (req, res) => {
  try {
    const { start, length, geo } = req.body;

    const data = await Local.find(
      {
        // country_code: {
        //   $in: [
        //     "AD",
        //     "AE",
        //     "AF",
        //     "AG",
        //     "AI",
        //     "AL",
        //     "AM",
        //     "AO",
        //     "AQ",
        //     "AR",
        //     "AS",
        //     "AT",
        //     "AU",
        //     "AW",
        //     "AZ",
        //     "BA",
        //     "BB",
        //     "BD",
        //     "BE",
        //     "BF",
        //     "BG",
        //     "BH",
        //     "BI",
        //     "BJ",
        //     "BL",
        //     "BM",
        //     "BN",
        //     "BO",
        //     "BQ",
        //     "BR",
        //     "BS",
        //     "BT",
        //     "BV",
        //     "BW",
        //     "BY",
        //     "BZ",
        //     "CA",
        //     "CC",
        //     "CD",
        //     "CF",
        //     "CG",
        //     "CH",
        //     "CI",
        //     "CK",
        //     "CL",
        //     "CM",
        //     "CN",
        //     "CO",
        //     "CR",
        //     "CU",
        //     "CV",
        //     "CW",
        //     "CX",
        //     "CY",
        //     "CZ",
        //     "DE",
        //     "DJ",
        //     "DK",
        //     "DM",
        //     "DO",
        //     "DZ",
        //     "EC",
        //     "EE",
        //     "EG",
        //     "EH",
        //     "ER",
        //     "ES",
        //     "ET",
        //     "FI",
        //     "FJ",
        //     "FK",
        //     "FM",
        //     "FO",
        //     "FR",
        //     "GA",
        //     "GB",
        //     "GD",
        //     "GE",
        //     "GF",
        //     "GG",
        //     "GH",
        //     "GI",
        //     "GL",
        //     "GM",
        //     "GN",
        //     "GP",
        //     "GQ",
        //     "GR",
        //     "GS",
        //     "GT",
        //     "GU",
        //     "GW",
        //     "GY",
        //     "HK",
        //     "HM",
        //     "HN",
        //     "HR",
        //     "HT",
        //     "HU",
        //     "ID",
        //     "IE",
        //     "IL",
        //     "IM",
        //     "IN",
        //     "IO",
        //     "IQ",
        //     "IR",
        //     "IS",
        //     "IT",
        //     "JE",
        //     "JM",
        //     "JO",
        //     "JP",
        //     "KE",
        //     "KG",
        //     "KH",
        //     "KI",
        //     "KM",
        //     "KN",
        //     "KP",
        //     "KR",
        //     "KW",
        //     "KY",
        //     "KZ",
        //     "LA",
        //     "LB",
        //     "LC",
        //     "LI",
        //     "LK",
        //     "LR",
        //     "LS",
        //     "LT",
        //     "LU",
        //     "LV",
        //     "LY",
        //     "MA",
        //     "MC",
        //     "MD",
        //     "ME",
        //     "MF",
        //     "MG",
        //     "MH",
        //     "MK",
        //     "ML",
        //     "MM",
        //     "MN",
        //     "MO",
        //     "MP",
        //     "MQ",
        //     "MR",
        //     "MS",
        //     "MT",
        //     "MU",
        //     "MV",
        //     "MW",
        //     "MX",
        //     "MY",
        //     "MZ",
        //     "NC",
        //     "NE",
        //     "NF",
        //     "NG",
        //     "NI",
        //     "NL",
        //     "NO",
        //     "NP",
        //     "NR",
        //     "NZ",
        //     "OM",
        //     "PA",
        //     "PE",
        //     "PF",
        //     "PG",
        //     "PH",
        //     "PK",
        //     "PL",
        //     "PM",
        //     "PN",
        //     "PR",
        //     "PS",
        //     "PT",
        //     "PW",
        //     "PY",
        //     "QA",
        //     "RE",
        //     "RO",
        //     "RS",
        //     "RU",
        //     "RW",
        //     "SA",
        //     "SB",
        //     "SC",
        //     "SD",
        //     "SE",
        //     "SG",
        //     "SH",
        //     "SI",
        //     "SJ",
        //     "SK",
        //     "SL",
        //     "SM",
        //     "SN",
        //     "SO",
        //     "SR",
        //     "SS",
        //     "ST",
        //     "SV",
        //     "SX",
        //     "SY",
        //     "SZ",
        //     "TC",
        //     "TD",
        //     "TF",
        //     "TG",
        //     "TH",
        //     "TJ",
        //     "TK",
        //     "TL",
        //     "TM",
        //     "TN",
        //     "TO",
        //     "TR",
        //     "TT",
        //     "TV",
        //     "TW",
        //     "TZ",
        //     "UA",
        //     "UG",
        //     "UM",
        //     "US",
        //     "UY",
        //     "UZ",
        //     "VA",
        //     "VC",
        //     "VE",
        //     "VG",
        //     "VI",
        //     "VN",
        //     "VU",
        //     "WF",
        //     "WS",
        //     "XK",
        //     "YE",
        //     "YT",
        //     "ZA",
        //     "ZM",
        //     "ZW",
        //   ],
        // },
        region: "AF",
      },
      { country_code: 1, region: 1, _id: 0 }
    ).limit(10000000);
    console.log(data);

    const dis = await data.distinct("country_code");

    // const count = await Local.countDocuments({ region: "" });
    if (!data) {
      res
        .status(404)
        .json({ status: 404, error: "404", message: "Data Not Found" });
      return;
    }

    const result = {
      dis: dis,
      // data: data,
    };
    res.status(200).json(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const chartForIndustry = async (req, res) => {
  try {
    const industry = await Local.distinct("industries");
    res.status(industry);
  } catch (error) {
    console.log("error", error);
    res.status(500).json("Internal Server Error");
  }
};

const totalFilterRecords = async (req, res) => {
  try {
    const { start, length, geo } = req.body;

    const filteredData = await Local.find({ country_code: "IN" })
      .limit(length)
      .skip(start);

    const count = await Local.countDocuments({ country_code: "IN" });
    console.log("count", count);

    if (!filteredData) {
      res.status(404).json({
        status: 404,
        error: "404",
        message: "Data Not Found",
      });
      return;
    }

    res.status(200).json({
      status: 200,
      data: filteredData,
      totalRecords: count,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "An error occurred",
    });
  }
};

const chartForCompanySize = asyncHandler(async (req, res) => {
  try {
    const companySizeRanges = [
      "Myself Only",
      "1-10 employees",
      "11-50 employees",
      "51-200 employees",
      "201-500 employees",
      "501-1000 employees",
      "1001-5000 employees",
      "5001-10,000 employees",
      "10,001+ employees",
    ];

    const companySizeCounts = await Local.aggregate([
      {
        $match: {
          company_size: { $in: companySizeRanges },
        },
      },
      {
        $group: {
          _id: "$company_size",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          company_size: "$_id",
          count: 1,
        },
      },
    ]).exec();

    const result = {
      total: 0,
    };

    companySizeCounts.forEach(({ company_size, count }) => {
      result[company_size] = count;
      // result.total += count;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const chartForRegion = asyncHandler(async (req, res) => {
  try {
    const regionMappings = {
      "North America": ["US", "CA", "MX", "GL", "BM", "PM"],
      "South America": [
        "VE",
        "UY",
        "SR",
        "PE",
        "PY",
        "GY",
        "EC",
        "CO",
        "CL",
        "BR",
        "BO",
        "AR",
      ],
      "Middle East": [
        "YE",
        "AE",
        "TR",
        "SY",
        "SA",
        "QA",
        "PS",
        "OM",
        "LB",
        "KW",
        "JO",
        "IL",
        "IQ",
        "IR",
        "CY",
        "BH",
      ],
      "North Africa": ["TN", "SD", "MA", "MR", "LY", "EG", "DZ"],
      India: ["IN"],
      "South East Asia": [
        "VN",
        "TL",
        "TH",
        "SG",
        "PH",
        "MM",
        "MY",
        "LA",
        "ID",
        "KH",
        "BN",
      ],
      ANZ: ["AU", "NZ"],
      EU: [
        "MK",
        "NL",
        "ME",
        "MC",
        "MD",
        "MT",
        "LU",
        "LT",
        "LI",
        "LV",
        "IT",
        "IE",
        "IS",
        "HU",
        "GR",
        "DE",
        "FR",
        "FI",
        "EE",
        "DK",
        "CZ",
        "CY",
        "HR",
        "BG",
        "BA",
        "BE",
        "BY",
        "AT",
        "AD",
        "AL",
        "VA",
        "GB",
        "UA",
        "CH",
        "SE",
        "ES",
        "SI",
        "SK",
        "RS",
        "SM",
        "RU",
        "RO",
        "PT",
        "PL",
        "NO",
      ],
    };

    const regionCounts = await Local.aggregate([
      {
        $match: {
          country_code: {
            $in: [].concat(...Object.values(regionMappings)),
          },
        },
      },
      {
        $group: {
          _id: "$country_code",
          count: { $sum: 1 },
        },
      },
    ]).exec();

    const result = {
      total: 0,
    };

    regionCounts.forEach(({ _id, count }) => {
      const region = Object.keys(regionMappings).find((key) =>
        regionMappings[key].includes(_id)
      );
      if (region) {
        if (!result[region]) {
          result[region] = 0;
        }
        result[region] += count;
        result.total += count;
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const chartForRegionNorthAmerica = async (req, res) => {
  try {
    const amr = { "North America": ["US", "CA", "MX", "GL", "BM", "PM"] };

    const data = await Local.find({
      region: { $in: ["US", "CA", "MX", "GL", "BM", "PM"] },
    });

    if (!data) {
      res
        .status(404)
        .json({ status: 404, error: "404", message: "Data Not Found" });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "500", message: "Internal Server Error" });
  }
};

const getDataTable = asyncHandler(async (req, res) => {
  try {
    const {
      length,
      start,
      companySize,
      geo,
      industry,
      jobFunction,
      intentSignals,
    } = req.body;

    // Prepare filter queries
    const filters = [];

    // Handle companySize filter
    if (companySize && companySize.length > 0) {
      filters.push({ company_size: { $in: companySize } });
    }

    // Handle geo filter
    if (geo && geo.length > 0) {
      const geoFilter = {
        // Define your geo mapping here
      };

      const countryCodes = geo.flatMap((g) => geoFilter[g] || []);

      if (countryCodes.length > 0) {
        filters.push({ country_code: { $in: countryCodes } });
      }
    }

    // Handle industry filter
    if (industry && industry.length > 0) {
      filters.push({ industries: { $in: industry } });
    }

    // Handle jobFunction filter
    if (jobFunction && jobFunction.length > 0) {
      filters.push({ employees: { $in: jobFunction } });
    }

    // Handle intentSignals filter
    if (intentSignals && intentSignals.length > 0) {
      filters.push({ specialties: { $in: intentSignals } });
    }

    // Construct the final query
    const query = filters.length > 0 ? { $and: filters } : {};

    // Count filtered records and total records using aggregation
    const [recordsFiltered, totalRecords] = await Promise.all([
      Local.aggregate([{ $match: query }, { $count: "count" }]).exec(),
      Local.countDocuments(),
    ]);

    // Calculate pagination values
    const totalPages = Math.ceil(recordsFiltered[0]?.count / length);
    const currentPage = Math.floor(start / length);

    // Find filtered records with pagination
    const data = await Local.find(query).skip(start).limit(length).exec();

    const result = {
      recordsTotal: totalRecords,
      recordsFiltered: recordsFiltered[0]?.count || 0,
      totalPages: totalPages,
      currentPage: currentPage,
      recordsPerPage: length,
      data: data,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const regions = {
  Africa: [
    "DZ",
    "AO",
    "BJ",
    "BW",
    "IO",
    "BF",
    "BI",
    "CV",
    "CM",
    "CF",
    "TD",
    "KM",
    "CG",
    "CD",
    "CI",
    "DJ",
    "EG",
    "GQ",
    "ER",
    "SZ",
    "ET",
    "TF",
    "GA",
    "GM",
    "GH",
    "GN",
    "GW",
    "KE",
    "LS",
    "LR",
    "LY",
    "MG",
    "MW",
    "ML",
    "MR",
    "MU",
    "YT",
    "MA",
    "MZ",
    "NA",
    "NE",
    "NG",
    "RE",
    "RW",
    "SH",
    "ST",
    "SN",
    "SC",
    "SL",
    "SO",
    "ZA",
    "SS",
    "SD",
    "TZ",
    "TG",
    "TN",
    "UG",
    "EH",
    "ZM",
    "ZW",
  ],
  Asia: [
    "AF",
    "AM",
    "AZ",
    "BH",
    "BD",
    "BT",
    "BN",
    "KH",
    "CN",
    "CY",
    "GE",
    "HK",
    "IN",
    "ID",
    "IR",
    "IQ",
    "IL",
    "JP",
    "JO",
    "KZ",
    "KP",
    "KR",
    "KW",
    "KG",
    "LA",
    "LB",
    "MO",
    "MY",
    "MV",
    "MN",
    "MM",
    "NP",
    "OM",
    "PK",
    "PS",
    "PH",
    "QA",
    "SA",
    "SG",
    "LK",
    "SY",
    "TW",
    "TJ",
    "TH",
    "TL",
    "TR",
    "TM",
    "AE",
    "UZ",
    "VN",
    "YE",
  ],
  Australia: [
    "AS",
    "AU",
    "CX",
    "CC",
    "CK",
    "FJ",
    "PF",
    "GU",
    "HM",
    "KI",
    "MH",
    "FM",
    "NR",
    "NC",
    "NZ",
    "NU",
    "NF",
    "MP",
    "PW",
    "PG",
    "PN",
    "WS",
    "SB",
    "TK",
    "TO",
    "TV",
    "UM",
    "VU",
    "WF",
  ],
  Europe: [
    "AX",
    "AX",
    "AL",
    "AD",
    "AT",
    "BY",
    "BE",
    "BA",
    "BA",
    "BG",
    "HR",
    "CZ",
    "DK",
    "EE",
    "FO",
    "FI",
    "FR",
    "DE",
    "GI",
    "GR",
    "GG",
    "VA",
    "HU",
    "IS",
    "IE",
    "IM",
    "IT",
    "JE",
    "LV",
    "LI",
    "LT",
    "LU",
    "MT",
    "MD",
    "MC",
    "ME",
    "NL",
    "MK",
    "NO",
    "PL",
    "PT",
    "RO",
    "RU",
    "SM",
    "RS",
    "SK",
    "SI",
    "ES",
    "SJ",
    "SE",
    "CH",
    "UA",
    "GB",
  ],
  NorthAmerica: [
    "BZ",
    "BM",
    "CA",
    "CR",
    "SV",
    "GL",
    "GT",
    "HN",
    "MX",
    "NI",
    "PA",
    "PM",
    "US",
  ],
  SouthAmerica: [
    "AI",
    "AG",
    "AR",
    "AW",
    "BS",
    "BB",
    "BO",
    "BQ",
    "BV",
    "BR",
    "KY",
    "CL",
    "CO",
    "CU",
    "CW",
    "DM",
    "DO",
    "EC",
    "FK",
    "GF",
    "GD",
    "GP",
    "GY",
    "HT",
    "JM",
    "MQ",
    "MS",
    "PY",
    "PE",
    "PR",
    "BL",
    "KN",
    "LC",
    "MF",
    "VC",
    "SX",
    "GS",
    "SR",
    "TT",
    "TC",
    "UY",
    "VE",
    "VG",
    "VI",
  ],
};
//Pipeline
const accountData = async (req, res) => {
  try {
    const {
      length,
      start,
      companySize,
      geo,
      industry,
      jobFunction,
      intentSignals,
      searchByCompanyAndWebsite,
    } = req.body;

    const pipeline = [];

    if (companySize.length > 0) {
      pipeline.push({
        $match: {
          company_size: {
            $in: companySize.map((title) => new RegExp(title, "i")),
          },
        },
      });
    }

    if (industry.length > 0) {
      pipeline.push({
        $match: {
          industries: {
            $in: industry.map((title) => new RegExp(title, "i")),
          },
        },
      });
    }

    if (geo.length > 0) {
      const regionFilter = geo.map((c) => ({
        country_code: { $in: regions[c] || [] },
      }));
      pipeline.push({
        $match: { $or: regionFilter },
      });
    }

    // if (jobFunction.length > 0) {
    //   pipeline.push({
    //     $match: {
    //       industries: {
    //         $in: jobFunction.map((title) => new RegExp(title, "i")),
    //       },
    //     },
    //   });
    // }

    if (searchByCompanyAndWebsite) {
      const companyWebsiteMatch = {
        $or: [
          { website: { $regex: new RegExp(searchByCompanyAndWebsite, "i") } },
          {
            companyName: { $regex: new RegExp(searchByCompanyAndWebsite, "i") },
          },
        ],
      };
      pipeline.push({ $match: companyWebsiteMatch });
    }

    // const exp = await Local.aggregate(pipeline).explain();
    // console.log("exp", exp);

    pipeline.push({ $skip: start });
    pipeline.push({ $limit: length });

    const data = await Local.aggregate(pipeline);

    const countPipeline = pipeline.slice(0, -2); // Remove skip and limit stages
    const count = await Local.aggregate([
      ...countPipeline,
      { $count: "count" },
    ]);
    const totalRecords = count.length > 0 ? count[0].count : 0;

    const totalPage = Math.ceil(totalRecords / length);
    const filteredPages = Math.ceil(data.length / length);

    const result = {
      recordsTotal: totalRecords,
      recordsFiltered: data.length,
      totalPages: totalPage,
      currentPage: filteredPages,
      recordsPerPage: length,
      data: data,
    };

    // res.status(200).json({
    //   totalRecords,
    //   totalPages,
    //   filteredRecords: data.length,
    //   filteredPages,
    //   data,
    // });

    res.status(200).json(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).json("Internal Server Error");
  }
};

//Filter
// const accountData = async (req, res) => {
//   try {
//     const {
//       length,
//       start,
//       companySize,
//       geo,
//       industry,
//       jobFunction,
//       intentSignals,
//       searchByCompanyAndWebsite,
//     } = req.body;

//     const filter = {};

//     if (Array.isArray(companySize) && companySize.length > 0) {
//       filter.company_size = {
//         $in: companySize.map((title) => new RegExp(title, "i")),
//       };
//     }

//     if (Array.isArray(industry) && industry.length > 0) {
//       filter.industries = {
//         $in: industry.map((title) => new RegExp(title, "i")),
//       };
//     }

//     if (Array.isArray(jobFunction) && jobFunction.length > 0) {
//       filter.jobFunction = {
//         $in: jobFunction.map((title) => new RegExp(title, "i")),
//       };
//     }

//     if (Array.isArray(geo) && geo.length > 0) {
//       const regionFilter = geo.map((c) => ({
//         country_code: { $in: regions[c] || [] },
//       }));
//       filter.$or = regionFilter;
//     }

//     if (searchByCompanyAndWebsite) {
//       filter.$or = [
//         { website: { $regex: new RegExp(searchByCompanyAndWebsite, "i") } },
//         { companyName: { $regex: new RegExp(searchByCompanyAndWebsite, "i") } },
//       ];
//     }

//     const explanation = await Local.find(filter).explain();
//     console.log("explanation", explanation);
//     const data = await Local.find(filter).skip(start).limit(length);

//     const totalRecords = explanation.executionStats.nReturned;
//     const totalPage = Math.ceil(totalRecords / length);
//     // const filteredPages = Math.ceil(data.length / length);

//     const result = {
//       recordsTotal: totalRecords,
//       recordsFiltered: data.length,
//       totalPages: totalPage,
//       currentPage: filteredPages,
//       recordsPerPage: length,
//       data: data,
//     };

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("error", error);
//     res.status(500).json("Internal Server Error");
//   }
// };

const crmData = asyncHandler(async (req, res) => {
  try {
    const {
      length,
      start,
      companySize,
      geo,
      industry,
      jobFunction,
      intentSignals,
    } = req.body;

    const filters = [];

    if (companySize && companySize.length > 0) {
      filters.push({ company_size: { $in: companySize } });
    }

    if (geo && geo.length > 0) {
      const geoFilter = {};

      const countryCodes = geo.flatMap((g) => geoFilter[g] || []);

      if (countryCodes.length > 0) {
        filters.push({ country_code: { $in: countryCodes } });
      }
    }

    if (industry && industry.length > 0) {
      filters.push({ industries: { $in: industry } });
    }

    if (jobFunction && jobFunction.length > 0) {
      filters.push({ employees: { $in: jobFunction } });
    }

    if (intentSignals && intentSignals.length > 0) {
      filters.push({ specialties: { $in: intentSignals } });
    }

    const query = filters.length > 0 ? { $and: filters } : {};

    const [recordsFiltered, totalRecords] = await Promise.all([
      Local.aggregate([{ $match: query }, { $count: "count" }]).exec(),
      Local.countDocuments(),
    ]);

    const totalPages = Math.ceil(recordsFiltered[0]?.count / length);
    const currentPage = Math.floor(start / length);

    const data = await Local.find(query).skip(start).limit(length).exec();

    const regionMappings = {
      "North America": ["US", "CA", "MX", "GL", "BM", "PM"],
      "South America": [
        "VE",
        "UY",
        "SR",
        "PE",
        "PY",
        "GY",
        "EC",
        "CO",
        "CL",
        "BR",
        "BO",
        "AR",
      ],
      "Middle East": [
        "YE",
        "AE",
        "TR",
        "SY",
        "SA",
        "QA",
        "PS",
        "OM",
        "LB",
        "KW",
        "JO",
        "IL",
        "IQ",
        "IR",
        "CY",
        "BH",
      ],
      "North Africa": ["TN", "SD", "MA", "MR", "LY", "EG", "DZ"],
      India: ["IN"],
      "South East Asia": [
        "VN",
        "TL",
        "TH",
        "SG",
        "PH",
        "MM",
        "MY",
        "LA",
        "ID",
        "KH",
        "BN",
      ],
      ANZ: ["AU", "NZ"],
      EU: [
        "MK",
        "NL",
        "ME",
        "MC",
        "MD",
        "MT",
        "LU",
        "LT",
        "LI",
        "LV",
        "IT",
        "IE",
        "IS",
        "HU",
        "GR",
        "DE",
        "FR",
        "FI",
        "EE",
        "DK",
        "CZ",
        "CY",
        "HR",
        "BG",
        "BA",
        "BE",
        "BY",
        "AT",
        "AD",
        "AL",
        "VA",
        "GB",
        "UA",
        "CH",
        "SE",
        "ES",
        "SI",
        "SK",
        "RS",
        "SM",
        "RU",
        "RO",
        "PT",
        "PL",
        "NO",
      ],
    };

    const regionCounts = await Local.aggregate([
      {
        $match: {
          country_code: {
            $in: [].concat(...Object.values(regionMappings)),
          },
        },
      },
      {
        $group: {
          _id: "$country_code",
          count: { $sum: 1 },
        },
      },
    ]).exec();

    const companySizeRanges = [
      "Myself Only",
      "1-10 employees",
      "11-50 employees",
      "51-200 employees",
      "201-500 employees",
      "501-1000 employees",
      "1001-5000 employees",
      "5001-10,000 employees",
      "10,001+ employees",
    ];

    const companySizeCounts = await Local.aggregate([
      {
        $match: {
          company_size: { $in: companySizeRanges },
        },
      },
      {
        $group: {
          _id: "$company_size",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          company_size: "$_id",
          count: 1,
        },
      },
    ]).exec();

    const result = {
      recordsTotal: totalRecords,
      recordsFiltered: recordsFiltered[0]?.count || 0,
      totalPages: totalPages,
      currentPage: currentPage,
      recordsPerPage: length,
      data: data,
      total: 0,
    };

    const regionResult = {
      total: 0,
    };

    regionCounts.forEach(({ _id, count }) => {
      const region = Object.keys(regionMappings).find((key) =>
        regionMappings[key].includes(_id)
      );
      if (region) {
        if (!regionResult[region]) {
          regionResult[region] = 0;
        }
        regionResult[region] += count;
        regionResult.total += count;
      }
    });

    const companySizeResult = {
      total: 0,
    };

    companySizeCounts.forEach(({ company_size, count }) => {
      companySizeResult[company_size] = count;
      companySizeResult.total += count;
    });

    res.status(200).json({ result, regionResult, companySizeResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = {
  getData,
  chartForRegionNorthAmerica,
  getDataTable,
  chartForCompanySize,
  chartForRegion,
  crmData,
  chartForIndustry,
  totalFilterRecords,
  accountData,
};
