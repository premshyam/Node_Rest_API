const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const corporateEventSchema = new Schema({
  filterName: { type: String, required: true, unique: true, dropDups: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("CorporateEvent", corporateEventSchema);
