const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const serviceableAreaSchema = new Schema({
  serviceableArea: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
});

module.exports = mongoose.model("ServiceableArea", serviceableAreaSchema);
