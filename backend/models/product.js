const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  categotyId: { type: mongoose.Schema.ObjectId, ref: "category" },
  name: String,
  price: String,
  description: String,
  image: String,
  available: Boolean,
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
