const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let itemSchema = new Schema({
  catererId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Caterer",
    required: true,
  },

  catererItems: [
    {
      itemCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemCategory",
        required: true,
      },
      items: [
        {
          itemName: { type: String, required: true },
          itemDescription: { type: String, required: false },
          itemImage: { type: String, required: false },
          spiceLevel: { type: Number, required: false },
          ribbon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ribbon",
            allowNull: true,
            default: null,
          },
          dietaryRestrictions: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dietary",
            required: false,
          },
          minimumPlates: { type: Number, required: false },
          services: { type: Array, required: false, allowNull: true },
          price: { type: Number, required: true },
          perUnit: { type: String, required: true },
        },
      ],
    },
  ],
});
module.exports = mongoose.model("Item", itemSchema);
