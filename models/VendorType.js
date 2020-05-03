const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const vendorTypeSchema = new Schema({
  vendorType: { type: String, required: true, unique: true, dropDups: true },
});

module.exports = mongoose.model("VendorType", vendorTypeSchema);
