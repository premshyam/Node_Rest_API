const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const serviceSchema = new Schema({
  filterName: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
});

module.exports = mongoose.model("Service", serviceSchema);
