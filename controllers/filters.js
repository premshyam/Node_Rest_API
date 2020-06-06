const CateringType = require("../models/CateringType");
const Dietary = require("../models/Dietary");
const Cuisine = require("../models/Cuisine");
const VendorType = require("../models/VendorType");
const Event = require("../models/Event");
const CorporateEvent = require("../models/CorporateEvent");
const Dish = require("../models/Dish");
const Ribbon = require("../models/Ribbon");

exports.fetch_filters = async (req, res, next) => {
  try {
    const cateringType = await CateringType.find().select("-__v");
    const dietary = await Dietary.find().select("-__v");
    const cuisine = await Cuisine.find().select("-__v");
    const vendorType = await VendorType.find().select("-__v");
    const event = await Event.find().select("-__v");
    const corporateEvent = await CorporateEvent.find().select("-__v");
    const dish = await Dish.find().select("-__v");
    const ribbon = await Ribbon.find().select("-__v");
    const catererFilters = [
      {
        filterType: "general",
        mainFilterName: "cateringType",
        filterValues: cateringType,
      },
      {
        filterType: "general",
        mainFilterName: "dietary",
        filterValues: dietary,
      },
      {
        filterType: "general",
        mainFilterName: "cuisine",
        filterValues: cuisine,
      },
      {
        filterType: "general",
        mainFilterName: "vendorType",
        filterValues: vendorType,
      },
      {
        filterType: "ribbon",
        mainFilterName: "ribbon",
        filterValues: ribbon,
      },
      {
        filterType: "event",
        mainFilterName: "event",
        filterValues: event,
      },
      {
        filterType: "corporateEvent",
        mainFilterName: "corporateEvent",
        filterValues: corporateEvent,
      },
      {
        filterType: "dish",
        mainFilterName: null,
        filterValues: dish,
      },
    ];
    res.json({
      message: "Filters Found",
      catererFilters: catererFilters,
    });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      errors: err,
    });
  }
};
