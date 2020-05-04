const CateringType = require("../models/CateringType");
const Dietary = require("../models/Dietary");
const Cuisine = require("../models/Cuisine");
const VendorType = require("../models/VendorType");
const Event = require("../models/Event");

exports.fetch_filters = async (req, res, next) => {
  try {
    const cateringType = await CateringType.find();
    const dietary = await Dietary.find();
    const cuisine = await Cuisine.find();
    const vendorType = await VendorType.find();
    const event = await Event.find();
    res.json({
      message: "Filters Found",
      cateringType: cateringType,
      dietary: dietary,
      cuisine: cuisine,
      vendorType: vendorType,
      event: event,
    });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      errors: err,
    });
  }
};
