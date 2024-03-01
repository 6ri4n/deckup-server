const User = require("../database/models/user");
const asyncHandler = require("../utils/asyncHandler");

const createDeck = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { deck: newDeck } = req.body;

  try {
    const foundUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { decks: newDeck } },
      { new: true }
    );

    if (!foundUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    res.status(200).json({ message: "Successfully created a new deck." });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const readDeck = asyncHandler(async (req, res) => {});

const updateDeck = asyncHandler(async (req, res) => {});

const deleteDeck = asyncHandler(async (req, res) => {});

module.exports = { createDeck, readDeck, updateDeck, deleteDeck };
