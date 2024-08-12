const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("DB connected suucessfully!"))
    .catch((error) => {
      console.log("DB connection failed!");
      console.error(error);
      process.exit(1);
    });
};

module.exports = dbConnect;
