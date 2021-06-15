const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.ObjectId, ref: "product" },
  employeeId: { type: mongoose.Schema.ObjectId, ref: "user" },
  cliendId: { type: mongoose.Schema.ObjectId, ref: "user" },
  date: { type: Date, default: Date.now },
  paymentMethod: String,
});

const Sale = mongoose.model("sale", saleSchema);
module.exports = Sale;
