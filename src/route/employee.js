const express = require("express");

const {
  getAllCompanyList,
  employeeFilter,
  searchByJobTitle,
} = require("../controller/employee");

const router = express.Router();

router.get("/getAllCompanyList", getAllCompanyList);
router.post("/employeeFilter", employeeFilter);
router.post("/searchByJobTitle", searchByJobTitle);

module.exports = router;
