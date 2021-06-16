const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multipart = require("connect-multiparty");
const mult = multipart();
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const ProductCategory = require("../models/productCategory");
const Product = require("../models/product");

const Auth = require("../middleware/auth");
const AuthUser = require("../middleware/user");
const Admin = require("../middleware/admin");
const Upload = require("../middleware/file");
const Provider = require("../middleware/provider");

router.post(
  "/newProduct",
  mult,
  Upload,
  Auth,
  AuthUser,
  Admin,
  async (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.price) {
      return res.status(400).send("Incomplete data");
    }

    let img = "";
    if (req.files !== undefined && req.files.image.type) {
      const url = req.protocol + "://" + req.get("host") + "/";
      let serverImg =
        "./uploads/" + moment().unix() + path.extname(req.files.image.path);
      fs.createReadStream(req.files.image.path).pipe(
        fs.createWriteStream(serverImg)
      );
      img =
        url + "uploads/" + moment().unix() + path.extname(req.files.image.path);
    }

    const category = await ProductCategory.findOne({ name: "empty" });
    if (!category) return res.status(400).send("No category was assigned");

    const product = new Product({
      categoryId: category._id,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: img,
      available: true,
    });

    const result = await product.save();
    if (!result) {
      return res.status(401).send("Failed to register product");
    } else {
      return res.status(200).send({ result });
    }
  }
);

router.get("/listProducts/:name?", Auth, AuthUser, async (req, res) => {
  const product = await Product.find({
    name: new RegExp(req.params["name"], "i"),
  })
    .populate("_id")
    .exec();

  if (!product) {
    return res.status(400).send("No products to list");
  } else {
    return res.status(200).send({ product });
  }
});

router.post("/editProduct", Auth, AuthUser, Admin, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.categoryId ||
    !req.body.name ||
    !req.body.price ||
    !req.body.description ||
    !req.body.available
  ) {
    return res.status(400).send("Incomplete data");
  }

  const idCheck = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!idCheck) {
    return res.status(400).send("Invalid id");
  }

  const product = await Product.findByIdAndUpdate(req.body._id, {
    category: req.body.categoryId,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    available: req.body.available,
  });

  if (!product) {
    return res.status(400).send("Product not found");
  } else {
    return res.status(200).send({ product });
  }
});

router.delete(
  "/deleteProduct/:_id",
  Auth,
  AuthUser,
  Admin,
  async (req, res) => {
    const idCheck = mongoose.Types.ObjectId.isValid(req.params._id);
    if (!idCheck) {
      return res.status(400).send("Invalid id");
    }

    const product = await Product.findByIdAndDelete(req.params._id);
    if (!product) {
      return res.status(400).send("Failed to delete category");
    } else {
      return res.status(200).send("Product deleted");
    }
  }
);

module.exports = router;
