const express = require("express");
const {
  getData,
  getDataTable,
  chartForCompanySize,
  chartForRegion,
  crmData,
} = require("../controller/data");

const router = express.Router();

router.get("/getData", getData);
router.post("/getDataTable", getDataTable);
router.get("/chartForCompanySize", chartForCompanySize);
router.get("/chartForRegion", chartForRegion);
router.post("/crmData", crmData);
module.exports = router;
