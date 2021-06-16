const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.ObjectId, ref: "product" },
  employeeId: { type: mongoose.Schema.ObjectId, ref: "employee" },
  clientId: { type: mongoose.Schema.ObjectId, ref: "client" },
  date: { type: Date, default: Date.now },
  price: String,
  paymentMethod: String
});

const Sale = mongoose.model("sale", saleSchema);
module.exports = Sale;
