const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let orderSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  shoppingCart: {
    type: Object,
    required: true,
  },
  orderAmount: { type: Number, required: true },
  orderDate: { type: Date, required: true },
  paymentAmount: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
});
module.exports = mongoose.model("Order", orderSchema);
