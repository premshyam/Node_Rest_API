const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const otpSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  otp: { type: Number, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: process.env.OTP_EXPIERY,
  },
});

module.exports = mongoose.model("Otp", otpSchema);
