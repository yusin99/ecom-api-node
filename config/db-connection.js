const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.log("Error while connecting to the database: ", error);
  }
};

module.exports = dbConnection;
