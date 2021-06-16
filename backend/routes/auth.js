const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Incorrect login info");
  }

  const hash = await bcrypt.compare(req.body.password, user.password);
  if (!user.status || !hash) {
    return res.status(400).send("Incorrect login info");
  }

  try {
    const jwtTk = user.generateJWT();
    return res.status(200).send({ jwtTk });
  } catch (error) {
    return res.status(400).send("Login error");
  }
});

module.exports = router;