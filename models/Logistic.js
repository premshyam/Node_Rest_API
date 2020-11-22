const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let logisticSchema = new Schema({
  name: { type: String, required: true },
  cgst: { type: Number, required: true },
  sgst: { type: Number, required: true },
});
module.exports = mongoose.model("Logistic", logisticSchema);
