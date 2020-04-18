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
  price: { type: Number, required: true },
  welcome_drinks: {
    selectionLimit: { type: Number, required: false, allowNull: true },
    items: { type: Array, required: false, allowNull: true },
  },
  starters: {
    selectionLimit: { type: Number, required: false, allowNull: true },
    items: { type: Array, required: false, allowNull: true },
  },
  main_course: {
    selectionLimit: { type: Number, required: false, allowNull: true },
    items: { type: Array, required: false, allowNull: true },
  },
  desserts: {
    selectionLimit: { type: Number, required: false, allowNull: true },
    items: { type: Array, required: false, allowNull: true },
  },
  chats: {
    selectionLimit: { type: Number, required: false, allowNull: true },
    items: { type: Array, required: false, allowNull: true },
  },
  beverages: {
    selectionLimit: { type: Number, required: false, allowNull: true },
    items: { type: Array, required: false, allowNull: true },
  },
});
module.exports = mongoose.model("Menu", menuSchema);
