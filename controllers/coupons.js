//validationResult for catching validation erros from express-validator middleware
const { validationResult } = require("express-validator");
//jsonwebtokens module for generating auth tokens
const jwt = require("jsonwebtoken");
const GeneralCoupon = require("../models/GeneralCoupon");
const CatererCoupon = require("../models/CatererCoupon");

exports.general = async (req, res, next) => {
  await GeneralCoupon.find({ caterer_id: req.params.id })
    .then((coupons) => {
      res.json({
        message: coupons.length + " Coupons Found",
        caterer: coupons,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

exports.caterer = async (req, res, next) => {
  await CatererCoupon.find()
    .then((coupons) => {
      res.json({
        message: coupons.length + " coupons Found",
        caterer: coupons,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};
