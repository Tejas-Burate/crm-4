const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId; // Import ObjectId
const Local = require("../model/data");
const asyncHandler = require("express-async-handler");

const getData = async (req, res) => {
  try {
    const data = await Local.find().limit(10);
    // console.log(data);
    if (!data) {
      res
        .status(404)
        .json({ status: 404, error: "404", message: "Data Not Found" });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error" });
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

    // Add region counts to the regionResult
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

    // Add company size counts to the companySizeResult
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
};
