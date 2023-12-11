const express = require("express");
const {
  getData,
  getDataTable,
  chartForCompanySize,
  chartForRegion,
  crmData,
  src,
  chartForRegionNorthAmerica,
  totalFilterRecords,
  chartForIndustry,
  accountData,
} = require("../controller/data");

const router = express.Router();

router.post("/getData", getData);
router.post("/src", src);
router.post("/getDataTable", getDataTable);
router.get("/chartForCompanySize", chartForCompanySize);
router.get("/chartForRegion", chartForRegion);
router.get("/chartForIndustry", chartForIndustry);
router.get("/chartForRegionNorthAmerica", chartForRegionNorthAmerica);
router.post("/crmData", crmData);
router.post("/accountData", accountData);
router.post("/totalFilterRecords", totalFilterRecords);
module.exports = router;
