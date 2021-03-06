const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let catererSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  serviceableArea: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceableArea",
      required: true,
    },
  ],
  cateringType: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CateringType",
      required: true,
    },
  ],
  dietaryRestrictions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dietary",
      required: true,
    },
  ],
  cuisineType: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cuisine",
      required: true,
    },
  ],
  vendorType: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorType",
      required: true,
    },
  ],
  speciality: { type: Array, required: true },
  event: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  ],
  dish: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish", required: true }],
  corporateEvent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CorporateEvent",
      required: true,
    },
  ],
  service: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  ],
  logistic: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Logistic", required: true },
  ],
  description: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, required: true },
  minimumOrderValue: { type: Number, required: true },
  // lead time is hours
  leadTime: { type: Number, required: true },
  availability: { type: Boolean, required: true, default: false },
  ribbon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ribbon",
    allowNull: true,
    default: null,
  },
  menuStartingFrom: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      rating: { type: Number, required: true },
      name: { type: String, required: true },
      comment: { type: String, required: true },
      ratingTime: { type: Date, required: true },
    },
  ],
});

catererSchema.statics.isEmailRegistered = function (email) {
  return this.find({ email: email }).then((result) => {
    //if count.length is > 0 it implies that email or phone is already registered
    if (result.length > 0) {
      //
      return Promise.reject("Email already registered");
    } else {
      //
      return true;
    }
  });
};

catererSchema.statics.isPhoneRegistered = function (phone) {
  return this.find({ phone: phone }).then((result) => {
    //if count.length is > 0 it implies that email or phone is already registered
    if (result.length > 0) {
      //
      return Promise.reject("Phone already registered");
    } else {
      //
      return true;
    }
  });
};

catererSchema.statics.isCatererEmail = function (email) {
  return this.find({ email: email }).then((result) => {
    //if count.length is > 0 it implies that email or phone is already registered
    if (result.length > 0) {
      //
      return true;
    } else {
      //
      return Promise.reject("Email not registered");
    }
  });
};

catererSchema.statics.isCatererPhone = function (phone) {
  return this.find({ phone: phone }).then((result) => {
    //if count.length is > 0 it implies that email or phone is already registered
    if (result.length > 0) {
      //
      return true;
    } else {
      //
      return Promise.reject("Phone not registered");
    }
  });
};
catererSchema.index({
  name: "text",
  speciality: "text",
});
module.exports = mongoose.model("Caterer", catererSchema);
