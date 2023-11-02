const express = require("express");

const { getAllCompanyList, employeeFilter } = require("../controller/employee");

const router = express.Router();

router.get("/getAllCompanyList", getAllCompanyList);
router.post("/employeeFilter", employeeFilter);

module.exports = router;
