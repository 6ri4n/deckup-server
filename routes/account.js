const express = require("express");
const router = express.Router();
const { signupUser, loginUser, logoutUser } = require("../controllers/auth");

router
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .patch("/logout", logoutUser);

module.exports = router;
