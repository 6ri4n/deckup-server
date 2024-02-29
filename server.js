require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./src/database/connectDB");
const statusCodeHandler = require("./src/utils/statusCodeHandler");
const app = express();
const accountRoute = require("./src/routes/account");
const deckRoute = require("./src/routes/deck");

connectDB(process.env.DB_URL);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/account", accountRoute);
app.use("/deck/:userId", deckRoute);

app.all("*", (req, res) => {
  res.status(404);
  throw new Error("Route not found");
});

app.use(statusCodeHandler);

app.listen(process.env.PORT);
