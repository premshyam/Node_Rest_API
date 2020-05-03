const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const cuisineSchema = new Schema({
  cuisineType: { type: String, required: true, unique: true, dropDups: true },
});

module.exports = mongoose.model("Cuisine", cuisineSchema);
