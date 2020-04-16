const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let catererSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true, select: false },
  password: { type: String, required: true, select: false },
  phone: { type: String, required: true },
  minimum_order_quantity: { type: Number, required: true },
  // lead time is hours
  lead_time: { type: Number, required: true },
  availability: { type: Boolean, required: true },
  menu_starting_from: { type: Number, required: true },
  delivery_fee: { type: Number, required: true },
  live_kitchen: { type: Boolean, required: true },
  image: { type: String, required: true },
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
