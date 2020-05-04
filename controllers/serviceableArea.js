//validationResult for catching validation erros from express-validator middleware
const { validationResult } = require("express-validator");
//jsonwebtokens module for generating auth tokens
const jwt = require("jsonwebtoken");
const ServiceableArea = require("../models/ServiceableArea");

exports.fetch_areas = async (req, res, next) => {
  await ServiceableArea.find()
    .then((areas) => {
      res.json({
        message: areas.length + " Areas Found",
        caterer: areas,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};
