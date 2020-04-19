const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let menuSchema = new Schema({
  caterer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Caterer",
    required: true,
  },
  menu_name: { type: String, required: true },
  menu_description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  welcome_drinks: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: { type: Array, required: false, allowNull: true },
    },
  ],
  starters: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: { type: Array, required: false, allowNull: true },
    },
  ],
  main_course: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: { type: Array, required: false, allowNull: true },
    },
  ],
  desserts: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: { type: Array, required: false, allowNull: true },
    },
  ],
  chats: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: { type: Array, required: false, allowNull: true },
    },
  ],
  beverages: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: { type: Array, required: false, allowNull: true },
    },
  ],
});
module.exports = mongoose.model("Menu", menuSchema);
