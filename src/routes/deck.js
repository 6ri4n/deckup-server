const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createDeck,
  readDeck,
  updateDeck,
  deleteDeck,
} = require("../controllers/deck");

router
  .get("/", readDeck)
  .post("/create", createDeck)
  .patch("/edit", updateDeck)
  .delete("/delete", deleteDeck);

module.exports = router;
