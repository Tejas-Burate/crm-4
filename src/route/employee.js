const express = require("express");

const {
  getAllCompanyList,
  employeeFilter,
  searchByJobTitle,
  searchByDepartment,
  searchByDepartmentAndJobTitle,
  chartForIndustries,
  filterEmailAndCompanyName,
  accountCount,
  distinctProst,
} = require("../controller/employee");

const router = express.Router();

router.get("/getAllCompanyList", getAllCompanyList);
router.get("/accountCount", accountCount);
router.post("/distinctProst", distinctProst);
router.get("/chartForIndustries", chartForIndustries);
router.post("/employeeFilter", employeeFilter);
router.post("/searchByJobTitle", searchByJobTitle);
router.post("/searchByDepartment", searchByDepartment);
router.post("/searchByDepartmentAndJobTitle", searchByDepartmentAndJobTitle);
router.post("/filterEmailAndCompanyName", filterEmailAndCompanyName);
module.exports = router;
