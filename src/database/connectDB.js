const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    const connect = await mongoose.connect(url);
    console.log(connect.connection.host, "connected:", connect.connection.name);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
