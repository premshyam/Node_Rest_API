const express = require("express");
const { check, body } = require("express-validator");
const filtersController = require("../controllers/filters");
const router = express.Router();

router.get("/fetch_filters", filtersController.fetch_filters);
module.exports = router;
