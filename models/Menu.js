const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

let menuSchema = new Schema({
  caterer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Caterer",
    required: true,
  },
  menuName: { type: String, required: true },
  menuDescription: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
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
          spice_level: { type: Number, required: false },
          dietary_restrictions: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dietary",
            required: false,
          },
        },
      ],
    },
  ],
});
module.exports = mongoose.model("Menu", menuSchema);
