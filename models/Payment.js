const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let paymentSchema = new Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  orderTransactionId: { type: String, required: true },
  orderAmount: { type: Number, required: false },
  referenceId: { type: String, required: false },
  txStatus: { type: String, required: false },
  paymentMode: { type: String, required: false },
  txMsg: { type: String, required: false },
  txTime: { type: String, required: false },
});
module.exports = mongoose.model("Payment", paymentSchema);
