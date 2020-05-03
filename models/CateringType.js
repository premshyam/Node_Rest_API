const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const cateringTypeSchema = new Schema({
  cateringType: { type: String, required: true, unique: true, dropDups: true },
});

module.exports = mongoose.model("CateringType", cateringTypeSchema);
