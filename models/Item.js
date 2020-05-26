const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let itemSchema = new Schema({
  caterer_id: {
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
          item_name: { type: String, required: true },
          item_description: { type: String, required: false },
          item_image: { type: String, required: false },
          spice_level: { type: Number, required: false },
          ribbon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ribbon",
            allowNull: true,
            default: null,
          },
          dietary_restrictions: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dietary",
            required: false,
          },
          minimumPlates: { type: Number, required: false },
          services: { type: Array, required: false, allowNull: true },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
});
module.exports = mongoose.model("Item", itemSchema);
