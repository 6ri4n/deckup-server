require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./src/database/connectDB");
const statusCodeHandler = require("./src/utils/statusCodeHandler");
const accountRoute = require("./src/routes/account");

connectDB(process.env.DB_URL);

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/account", accountRoute);

app.all("*", (req, res) => {
  res.status(404);
  throw new Error("Route not found");
});

app.use(statusCodeHandler);

app.listen(process.env.PORT);
