const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const menuCategorySchema = new Schema({
  Category: { type: String, required: true, unique: true, dropDups: true },
});

module.exports = mongoose.model("MenuCategory", menuCategorySchema);
