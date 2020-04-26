const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let itemSchema = new Schema({
  caterer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Caterer",
    required: true,
  },

  welcome_drinks: [
    {
      dishes: { type: String, required: true },
      items: [
        {
          item_name: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
  starters: [
    {
      dishes: { type: String, required: true },
      items: [
        {
          item_name: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
  main_course: [
    {
      dishes: { type: String, required: true },
      items: [
        {
          item_name: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
  desserts: [
    {
      dishes: { type: String, required: true },
      items: [
        {
          item_name: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
  chats: [
    {
      dishes: { type: String, required: true },
      items: [
        {
          item_name: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
  beverages: [
    {
      dishes: { type: String, required: true },
      items: [
        {
          item_name: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
});
module.exports = mongoose.model("Item", itemSchema);
