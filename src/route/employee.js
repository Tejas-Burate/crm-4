const express = require("express");

const {
  getAllCompanyList,
  search,
  chartForJobTitles,
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
router.get("/chartForJobTitles", chartForJobTitles);
router.get("/distinctProst", distinctProst);
router.get("/chartForIndustries", chartForIndustries);
router.post("/employeeFilter", employeeFilter);
router.post("/search", search);
router.post("/searchByJobTitle", searchByJobTitle);
router.post("/searchByDepartment", searchByDepartment);
router.post("/searchByDepartmentAndJobTitle", searchByDepartmentAndJobTitle);
router.post("/filterEmailAndCompanyName", filterEmailAndCompanyName);
module.exports = router;
