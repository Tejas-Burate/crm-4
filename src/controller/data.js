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
      result.total += count;
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
  getDataTable,
  chartForCompanySize,
  chartForRegion,
  crmData,
  totalFilterRecords,
};
