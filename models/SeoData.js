const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const seoDataSchema = new Schema({
  pageSlug: {
    type: String,
    required: true,
  },
  pageType: {
    type: String,
    required: true,
  },
  title: { type: String },
  description: { type: String },
  keywords: { type: String },
  image: { type: String },
});
module.exports = mongoose.model("SeoData", seoDataSchema);
