const { StatusCodes } = require("http-status-codes");
const Seo = require("../models/SeoData");
const { validationResult } = require("express-validator");

exports.getSeoData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  req.query.pageSlug = req.query.pageSlug.replace(/-/g, " ");
  req.query.pageType = req.query.pageType.replace(/-/g, " ");
  Seo.findOne({
    pageSlug: {
      $regex: new RegExp(req.query.pageSlug.replace(/-/g, " "), "i"),
    },
    pageType: {
      $regex: new RegExp(req.query.pageType.replace(/-/g, " "), "i"),
    },
  })
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "Not found",
        });
      }
    })
    .catch((err) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};
