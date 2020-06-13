const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const foodCategoryItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  image: { type: String, required: false },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodCategory",
    allowNull: true,
    default: null,
  },
  dietaryRestrictions: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dietary",
    required: false,
  },
  ribbon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ribbon",
    allowNull: true,
    default: null,
  },
});

module.exports = mongoose.model("FoodCategoryItem", foodCategoryItemSchema);
