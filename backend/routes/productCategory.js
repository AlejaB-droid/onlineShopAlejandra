const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const ProductCategory = require("../models/productCategory");

const Auth = require("../middleware/auth");
const AuthUser = require("../middleware/user");
const Admin = require("../middleware/admin");
const Provider = require("../middleware/provider");

router.post("/newCategory", Auth, AuthUser, Admin, Provider, async (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).send("Incomplete data");
  }

  const productCategory = new ProductCategory({
    userId: req.user._id,
    name: req.body.name,
    description: req.body.description,
  });

  const result = await productCategory.save();
  if (!result) {
    return res.status(401).send("Failed to register product category");
  } else {
    return res.status(200).send({ result });
  }
});

router.get("/listCategories/:name?", Auth, AuthUser, async (req, res) => {
  const categories = await ProductCategory.find({
    name: new RegExp(req.params["name"], "i"),
  })
    .populate("_id")
    .exec();

  if (!categories) {
    return res.status(400).send("No categories to list");
  } else {
    return res.status(200).send({ categories });
  }
});

router.post("/editCategory", Auth, AuthUser, Admin, Provider, async (req, res) => {
  if (!req.body._id || !req.body.name || !req.body.description) {
    return res.status(400).send("Incomplete data");
  }

  const idCheck = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!idCheck) {
    return res.status(400).send("Invalid id");
  }

  const category = await ProductCategory.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
  });

  if (!category) {
    return res.status(400).send("Category not found");
  } else {
    return res.status(200).send({ category });
  }
});

router.delete(
  "/deleteCategory/:_id",
  Auth,
  AuthUser,
  Admin,
  Provider,
  async (req, res) => {
    const idCheck = mongoose.Types.ObjectId.isValid(req.params._id);
    if (!idCheck) {
      return res.status(400).send("Invalid id");
    }

    const category = await ProductCategory.findByIdAndDelete(req.params._id);
    if (!category) {
      return res.status(400).send("Failed to delete category");
    } else {
      return res.status(200).send("Category deleted");
    }
  }
);

module.exports = router;
