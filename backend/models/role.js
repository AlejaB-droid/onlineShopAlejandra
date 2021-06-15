const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: String,
  description: String
});

const Role = mongoose.model("role", roleSchema);
module.exports = Role;
