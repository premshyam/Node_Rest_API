const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

// const cartSchema = new Schema({
//   menu_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Menu",
//     required: true
//   },
//   quantity: { type: Number, required: true }
// });

const customerSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false }, // by default exclude password from the query result
  phone: { type: String, required: true },
  verified: { type: Boolean, required: true, default: false },
  // cart: [cartSchema],
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
});

customerSchema.statics.isEmailRegistered = function (email) {
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

customerSchema.statics.isPhoneRegistered = function (phone) {
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

customerSchema.statics.isCustomerEmail = function (email) {
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

customerSchema.statics.isCustomerPhone = function (phone) {
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

module.exports = mongoose.model("Customer", customerSchema);
