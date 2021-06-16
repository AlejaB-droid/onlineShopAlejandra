const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./db/db");
require("dotenv").config();

const Role = require("./routes/role");
const User = require("./routes/user");
const Auth = require("./routes/auth");
const productCategory = require("./routes/productCategory");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/role/", Role);
app.use("/api/user/", User);
app.use("/api/auth/", Auth);
app.use("/api/productCategory/", productCategory);

app.listen(process.env.PORT, () =>
  console.log("Server running on port: " + process.env.PORT)
);

dbConnection();
