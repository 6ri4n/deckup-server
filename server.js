require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./src/database/connectDB");
const statusCodeHandler = require("./src/utils/statusCodeHandler");
const app = express();
const validateJWT = require("./src/middleware/validateJWT");
const accountRoute = require("./src/routes/account");
const deckRoute = require("./src/routes/deck");
const categoryRoute = require("./src/routes/category");

connectDB(process.env.DB_URL);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cookie"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/account", accountRoute);
app.use("/api/deck", validateJWT, deckRoute);
app.use("/api/category", validateJWT, categoryRoute);

app.all("*", (req, res) => {
  res.status(404);
  throw new Error("Route not found");
});

app.use(statusCodeHandler);

app.listen(process.env.PORT);
