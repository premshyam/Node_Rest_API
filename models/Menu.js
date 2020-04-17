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
  welcome_drinks: { type: Array, required: false, allowNull: true },
  starters: { type: Array, required: false, allowNull: true },
  main_course: { type: Array, required: false, allowNull: true },
  desserts: { type: Array, required: false, allowNull: true },
  chats: { type: Array, required: false, allowNull: true },
  beverages: { type: Array, required: false, allowNull: true },
});
module.exports = mongoose.model("Menu", menuSchema);
