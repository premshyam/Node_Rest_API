const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const generalCouponSchema = new Schema({
  coupon_description: { type: String, required: true },
  coupon_code: { type: String, required: true },
  minimum_purchase_value: { type: Number, required: true },
  discount_amount: { type: Number, required: true },
  expireAt: { type: Date, required: true },
});

generalCouponSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("GeneralCoupon", generalCouponSchema);
