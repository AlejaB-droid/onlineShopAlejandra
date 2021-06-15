const mongoose = require("mongoose");

const Stock = new mongoose.Schema({
  productId: { type: mongoose.Schema.ObjectId, ref: "product" },
  quantity: String,
});

const Stock = mongoose.model("stock", stockSchema);
module.exports = Stock;
