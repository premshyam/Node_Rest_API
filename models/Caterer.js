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
  description: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, required: true },
  minimum_order_value: { type: Number, required: true },
  // lead time is hours
  lead_time: { type: Number, required: true },
  availability: { type: Boolean, required: true, default: false },
  ribbon: { type: String, allowNull: true, default: null },
  menu_starting_from: { type: Number, required: true },
  delivery_fee: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      name: { type: String, required: true },
      text: { type: String, required: true },
      Date: { type: Date, required: true },
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

module.exports = mongoose.model("Caterer", catererSchema);
