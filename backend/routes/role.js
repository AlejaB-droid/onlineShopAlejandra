const express = require("express");
const router = express.Router();

const Role = require("../models/role");

const Auth = require("../middleware/auth");
const Admin = require("../middleware/admin");
const AuthUser = require("../middleware/user");

router.post("/roleRegistration", Auth, AuthUser, Admin, async (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).send("Incomplete data");
  }

  const checkRole = await Role.findOne({ name: req.body.name });
  if (checkRole) {
    return res.status(400).send("The role already exists");
  }

  const role = new Role({
    name: req.body.name,
    description: req.body.description,
  });

  const result = await role.save();
  if (!result) {
    return res.status(401).send("Failed to register role");
  } else {
    return res.status(200).send({ result });
  }
});

router.get("/listRoles", Auth, AuthUser, Admin, async (req, res) => {
  const role = await Role.find();
  if (!role) {
    res.status(400).send("There are no roles to list");
  } else {
    return res.status(200).send({ role });
  }
});

module.exports = router;
