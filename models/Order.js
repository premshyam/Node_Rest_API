const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let orderSchema = new Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  caterer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Caterer",
    required: true,
  },
  menu_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
  cart: { type: {}, required: true },
  quantity: { type: Number, required: true },
  order_amount: { type: Number, required: true },
  order_date: { type: Date, required: true },
  delivery_date: { type: Date, required: true },
  order_status: { type: String, required: true, default: "active" },
});
module.exports = mongoose.model("Order", orderSchema);
