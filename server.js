require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./utils/connectDB");
const statusCodeHandler = require("./utils/statusCodeHandler");
const signupRoute = require("./routes/signup");

connectDB(process.env.DB_URL);

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/signup", signupRoute);

app.all("*", (req, res) => {
  res.status(404);
  throw new Error("Route not found");
});

app.use(statusCodeHandler);

app.listen(process.env.PORT);
