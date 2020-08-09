const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let cartSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  caterer: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caterer",
      required: false,
    },
    name: { type: String, required: false },
    image: { type: String, required: false },
  },
  cartItems: [
    {
      cuisineCategoryName: { type: String, required: true },
      cuisineCategoryDescription: { type: String, required: true },
      cuisineCategoryImage: { type: String, required: true },
      cuisineCategoryId: { type: String, required: true },
      minPlates: { type: Number, required: true },
      totalPlates: { type: Number, required: true },
      specialInstruction: { type: String, required: true },
      price: { type: Number, required: true },
      perUnit: { type: String, required: true },
      menuDetails: [
        {
          id: { type: String, required: true },
          menuItemCategory: {
            id: { type: String, required: true },
            category: { type: String, required: true },
          },
          menuItems: [
            {
              id: { type: String, required: true },
              name: { type: String, required: true },
            },
          ],
        },
      ],
    },
  ],
});
module.exports = mongoose.model("Cart", cartSchema);
