const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let cartSchema = new Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    required: true
  },
  menu_id: { type: String, required: true },
  quantity: { type: Number, required: true }
});
module.exports = mongoose.model("Cart", cartSchema);
