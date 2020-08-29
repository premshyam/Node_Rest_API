const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let cartSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  shoppingCart: {
    type: Object,
    required: false,
  },
});
module.exports = mongoose.model("Cart", cartSchema);
