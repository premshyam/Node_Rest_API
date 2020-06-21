const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let menuSchema = new Schema({
  catererId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Caterer",
    required: true,
  },
  catererMenus: [
    {
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuCategory",
        required: true,
      },
      menus: [
        {
          name: { type: String, required: true },
          description: { type: String, required: true },
          image: { type: String, required: false },
          price: { type: Number, required: true },
          perUnit: { type: String, required: true },
          services: { type: Array, required: false, allowNull: true },
          ribbon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ribbon",
            allowNull: true,
            default: null,
          },
          minimumPlates: { type: Number, required: false },
          menuDetails: [
            {
              itemCategory: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ItemCategory",
                required: true,
              },
              selectionLimit: {
                type: Number,
                required: false,
                allowNull: true,
                default: null,
              },
              items: [
                {
                  name: { type: String, required: true },
                  spiceLevel: { type: Number, required: false },
                  dietaryRestrictions: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Dietary",
                    required: false,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
module.exports = mongoose.model("Menu", menuSchema);
