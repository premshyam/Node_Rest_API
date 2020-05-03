const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const eventSchema = new Schema({
  eventType: { type: String, required: true, unique: true, dropDups: true },
});

module.exports = mongoose.model("Event", eventSchema);
