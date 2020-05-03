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
  services: { type: Array, required: false, allowNull: true },
  welcome_drinks: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: [
        {
          name: { type: String, required: true },
          spice_level: { type: Number, required: false },
          dietary_restrictions: { type: String, required: true },
        },
      ],
    },
  ],
  starters: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: [
        {
          name: { type: String, required: true },
          spice_level: { type: Number, required: false },
          dietary_restrictions: { type: String, required: true },
        },
      ],
    },
  ],
  main_course: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: [
        {
          name: { type: String, required: true },
          spice_level: { type: Number, required: false },
          dietary_restrictions: { type: String, required: true },
        },
      ],
    },
  ],
  desserts: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: [
        {
          name: { type: String, required: true },
          spice_level: { type: Number, required: false },
          dietary_restrictions: { type: String, required: true },
        },
      ],
    },
  ],
  chats: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: [
        {
          name: { type: String, required: true },
          spice_level: { type: Number, required: false },
          dietary_restrictions: { type: String, required: true },
        },
      ],
    },
  ],
  beverages: [
    {
      dishes: { type: String, required: true },
      selectionLimit: { type: Number, required: false, allowNull: true },
      items: [
        {
          name: { type: String, required: true },
          spice_level: { type: Number, required: false },
          dietary_restrictions: { type: String, required: true },
        },
      ],
    },
  ],
});
module.exports = mongoose.model("Menu", menuSchema);
