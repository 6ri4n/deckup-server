const express = require("express");
const router = express.Router();
const signupUser = require("../controllers/signupUser");

router.route("/").post(signupUser);

module.exports = router;
