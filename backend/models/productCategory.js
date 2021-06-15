const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Category = mongoose.model("category", categorySchema);
module.exports = Category;
