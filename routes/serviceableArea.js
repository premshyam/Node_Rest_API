const express = require("express");
const ServiceableArea = require("../models/ServiceableArea");
const serviceableAreaController = require("../controllers/serviceableArea");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/fetch_areas", serviceableAreaController.fetch_areas);
module.exports = router;
