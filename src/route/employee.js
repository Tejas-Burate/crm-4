const express = require("express");

const {
  getAllCompanyList,
  employeeFilter,
  searchByJobTitle,
  searchByDepartment,
  searchByDepartmentAndJobTitle,
} = require("../controller/employee");

const router = express.Router();

router.get("/getAllCompanyList", getAllCompanyList);
router.post("/employeeFilter", employeeFilter);
router.post("/searchByJobTitle", searchByJobTitle);
router.post("/searchByDepartment", searchByDepartment);
router.post("/searchByDepartmentAndJobTitle", searchByDepartmentAndJobTitle);

module.exports = router;
