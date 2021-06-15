const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("Connected with MongoDB");
  } catch (e) {
    console.log("Error while trying to connect with MongoDB: ", e);
    throw new Error("Error while trying to connect with MongoDB");
  }
};

module.exports = { dbConnection };
