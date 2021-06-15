const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  location: String,
  status: Boolean,
  date: { type: Date, default: Date.now },
  roleId: { type: mongoose.Schema.ObjectId, ref: "role" },
});

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      roleId: this.roleId,
      iat: moment().unix(),
    },
    process.env.SECRET_kEY_JWT
  );
};

const User = mongoose.model("user", userSchema);
module.exports = User;
