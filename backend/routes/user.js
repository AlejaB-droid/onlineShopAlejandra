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

  let user = await User.findOne({ email: field.email });
  if (user) {
    return res.status(400).send("The user is already exists");
  }

  const role = await Role.findOne({ name: "client" });
  if (!role) {
    return res.status(400).send("No role was assigned");
  }

  const hash = await bcrypt.hash(req.body.password, 20);

  user = new User({
    fullName: field.fullName,
    email: field.email,
    password: hash,
    location: field.location,
    status: true,
    roleId: role._id,
  });

  try {
    const result = await user.save();
    if (!result) {
      return res.status(400).send("Failed to register user");
    }
    const jwtTk = user.generateJWT();
    res.status(200).send({ jwtTk });
  } catch (error) {
    return res.status(400).send("Failed to register user");
  }
});

router.get("/listUsers/:fullName?", Auth, AuthUser, Admin, async (req, res) => {
  const users = await User.find({
    fullName: new RegExp(req.params["fullName"], "i"),
  })
    .populate("roleId")
    .exec();

  if (!users) {
    return res.status(400).send("There are no users to list");
  } else {
    return res.status(200).send({ users });
  }
});

router.post("/adminRegistration", Auth, async (req, res) => {
  const field = req.body;
  if (
    !field.fullName ||
    !field.email ||
    !field.password ||
    !field.location ||
    !field.roleId
  ) {
    return res.status(400).send("Incomplete data");
  }

  const idCheck = mongoose.Types.ObjectId.isValid(field.roleId);
  if (!idCheck) {
    return res.status(400).send("Invalid id");
  }

  let user = await User.findOne({ email: field.email });
  if (user) {
    return res.status(400).send("The user is already registered");
  }

  const hash = await bcrypt.hash(req.body.password, 20);

  user = new User({
    fullName: field.fullName,
    email: field.email,
    password: hash,
    location: field.location,
    status: true,
    roleId: req.body.roleId,
  });

  try {
    const result = await user.save();
    if (!result) {
      return res.status(400).send("Failed to register user");
    }
    const jwtTk = user.generateJWT();
    res.status(200).send({ jwtTk });
  } catch (error) {
    return res.status(400).send("Failed to register user");
  }
});

router.put("/updateUser", Auth, AuthUser, Admin, async (req, res) => {
  const field = req.body;
  if (
    !field._id ||
    !field.fullName ||
    !field.email ||
    !field.password ||
    !field.location ||
    !field.status ||
    !field.roleId
  ) {
    return res.status(400).send("Incomplete data");
  }

  const hash = await bcrypt.hash(field.password, 20);

  const user = await User.findByIdAndUpdate(field._id, {
    fullName: field.fullName,
    email: field.email,
    password: hash,
    location: field.location,
    status: field.status,
    roleId: field.roleId,
  });

  if (!user) {
    return res.status(401).send("Error while editing the user");
  } else {
    return res.status(200).send({ user });
  }
});

router.put("/deleteUser/", Auth, AuthUser, Admin, async (req, res) => {
  const field = req.body;
  if (
    !field._id ||
    !field.fullName ||
    !field.email ||
    !field.password ||
    !field.location ||
    !field.roleId
  ) {
    return res.status(400).send("Incomplete data");
  }

  const hash = await bcrypt.hash(field.password, 20);

  const user = await User.findByIdAndUpdate(field._id, {
    fullName: field.fullName,
    email: field.email,
    password: hash,
    location: field.location,
    status: false,
    roleId: field.roleId,
  });

  if (!user) {
    return res.status(401).send("Error while editing the user");
  } else {
    return res.status(200).send({ user });
  }
});
module.exports = router;
