const express = require("express");
const seoController = require("../controllers/seo");
const { query } = require("express-validator");
const router = express.Router();

router.get(
  "/seo_data",
  [query("pageSlug").isString(), query("pageType").isString()],
  seoController.getSeoData
);

module.exports = router;
