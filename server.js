require("dotenv").config();
const express = require("express");
const server = express();
const connectDB = require("./utils/connectDB");
const errorHandler = require("./utils/errorHandler");

connectDB(process.env.DB_URL);

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

server.all("*", (req, res) => {
  res.status(404);
  throw new Error("Route not found");
});

server.use(errorHandler);

server.listen(process.env.PORT);
