const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../models/user");
const Role = require("../models/role");

const Admin = require("../middleware/admin");
const Auth = require("../middleware/auth");
const AuthUser = require("../middleware/user");

router.post("/userRegistration", async (req, res) => {
  const field = req.body;
  if (!field.fullName || !field.email || !field.password || !field.location) {
    return rs.status(400).send("Incomplete data");
  }

  let user = await USer.findOne({ email: field.email });
  if (user) {
    return res.status(400).send("The user is already exists");
  };

  const role = await Role.findOne({ name: "user" });
  if (!role) {
    return res.status(400).send("No role was assigned");
  };

  const hash = await bcrypt.hahs(req.body.password, 20);

  user = new User({
    fullName: field.fullName,
    email: field.email,
    password: hash,
    location: field.location,
    status: true,
    roleId: role._id
  });

  try {
    const result = await user.save();
    if (!result) {
        return res.status(400).send("Failed to register user");
    };
    const jwtTk = user.generateJWT();
    res.status(200).send({ jwtTk });
  } catch (error) {
    return res.status(400).send("Failed to register user");
  }
});
