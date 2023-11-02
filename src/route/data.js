const express = require("express");
const {
  getData,
  getDataTable,
  chartForCompanySize,
  chartForRegion,
  crmData,
  totalFilterRecords,
} = require("../controller/data");

const router = express.Router();

router.post("/getData", getData);
router.post("/getDataTable", getDataTable);
router.get("/chartForCompanySize", chartForCompanySize);
router.get("/chartForRegion", chartForRegion);
router.post("/crmData", crmData);
router.post("/totalFilterRecords", totalFilterRecords);
module.exports = router;
