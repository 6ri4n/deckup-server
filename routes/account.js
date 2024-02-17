const express = require("express");
const router = express.Router();
const signupUser = require("../controllers/signupUser");
const loginUser = require("../controllers/loginUser");
const logoutUser = require("../controllers/logoutUser");

router
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .patch("/logout", logoutUser);

module.exports = router;
