const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const catererCouponSchema = new Schema({
  caterer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Caterer",
    required: true,
  },
  coupon_description: { type: String, required: true },
  coupon_code: { type: String, required: true },
  minimum_purchase_value: { type: Number, required: true },
  discount_amount: { type: Number, required: true },
});

module.exports = mongoose.model("CatererCoupon", catererCouponSchema);
