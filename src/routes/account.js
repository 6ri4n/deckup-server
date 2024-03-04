const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  logoutUser,
  refreshUser,
} = require("../controllers/auth");

router
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .post("/logout", logoutUser)
  .post("/refresh", refreshUser);

module.exports = router;
