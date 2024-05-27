const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  readCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

router
  .get("/", readCategory)
  .post("/create", createCategory)
  .patch("/edit", updateCategory)
  .delete("/delete", deleteCategory);

module.exports = router;
