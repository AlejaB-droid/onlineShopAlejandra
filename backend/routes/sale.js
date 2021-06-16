const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const moment = require("moment");

const Sale = require("../models/sale");

const Auth = require("../middleware/auth");
const AuthUser = require("../middleware/user");
const Admin = require("../middleware/admin");

router.post(
  "/newSale",
  Auth,
  AuthUser,
  Admin,
  async (req, res) => {
    if (!req.body.productId|| !req.body.employeeId || !req.body.clientId || !req.body.price || !req.body.paymentMethod) {
      return res.status(400).send("Incomplete data");
    }

    const sale = new Sale({
      productId: req.body.productId,
      employeeId: req.body.employeeId,
      clientId: req.body.clientId,
      price: req.body.price,
      paymentMethod: req.body.paymentMethod
    });

    const result = await sale.save();
    if (!result) {
      return res.status(401).send("Failed to register sale");
    } else {
      return res.status(200).send({ result });
    }
  }
);

router.get("/listSale", Auth, AuthUser, Admin, async (req, res) => {
  const sale = await Sale.find();

  if (!sale) {
    return res.status(400).send("No sales to list");
  } else {
    return res.status(200).send({ sale });
  }
});

router.post("/editSale", Auth, AuthUser, Admin, async (req, res) => {
    if (!req.body._id || !req.body.productId|| !req.body.employeeId || !req.body.clientId || !req.body.price || !req.body.paymentMethod) {
        return res.status(400).send("Incomplete data");
      }

  const idCheck = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!idCheck) {
    return res.status(400).send("Invalid id");
  }

  const sale = await Sale.findByIdAndUpdate(req.body._id, {
    _id: req.body._id,
    productId: req.body.productId,
    employeeId: req.body.employeeId,
    clientId: req.body.clientId,
    price: req.body.price,
    paymentMethod: req.body.paymentMethod
  });

  if (!sale) {
    return res.status(400).send("Sale not found");
  } else {
    return res.status(200).send({ sale });
  }
});

router.delete(
  "/deleteSale/:_id",
  Auth,
  AuthUser,
  Admin,
  async (req, res) => {
    const idCheck = mongoose.Types.ObjectId.isValid(req.params._id);
    if (!idCheck) {
      return res.status(400).send("Invalid id");
    }

    const sale = await Sale.findByIdAndDelete(req.params._id);
    if (!sale) {
      return res.status(400).send("Failed to delete sale");
    } else {
      return res.status(200).send("Sale deleted");
    }
  }
);

module.exports = router;