const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    location: String,
    date: { type: Date, default: Date.now },
    roleId: { type: mongoose.Schema.ObjectId, ref: "role" }
});