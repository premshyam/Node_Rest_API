const express = require("express");
// const ServiceableArea = require("../models/GeneralCoupon");
const couponController = require("../controllers/coupons");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/general", couponController.general);
router.get("/caterer/:id", couponController.caterer);
module.exports = router;
