const User = require("../database/models/user");
const asyncHandler = require("../utils/asyncHandler");

const createDeck = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { deck: newDeck } = req.body;

  if (!newDeck) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  if (newDeck.flashcards.length > 20) {
    res.status(400);
    throw new Error("Deck must not exceed 20 cards.");
  }

  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { decks: newDeck } },
      { new: true }
    );

    res.status(200).json({ message: "Successfully created a new deck." });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const readDeck = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    res.status(200).json({ decks: foundUser.decks });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const updateDeck = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { _id: deckId, deck: updatedDeck } = req.body;

  if (!deckId || !updatedDeck) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  if (updatedDeck.flashcards.length > 20) {
    res.status(400);
    throw new Error("Deck must not exceed 20 cards.");
  }

  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    const foundDeck = await User.findOne({ _id: userId, "decks._id": deckId });

    if (!foundDeck) {
      res.status(404);
      throw new Error("Deck not found.");
    }

    await User.findOneAndUpdate(
      { _id: userId, "decks._id": deckId },
      { $set: { "decks.$": updatedDeck } },
      { new: true }
    );

    res.status(200).json({ message: "Successfully updated the deck." });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const deleteDeck = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { _id: deckId } = req.body;

  if (!deckId) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    const foundDeck = await User.findOne({ _id: userId, "decks._id": deckId });

    if (!foundDeck) {
      res.status(404);
      throw new Error("Deck not found.");
    }

    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { decks: { _id: deckId } } },
      { new: true }
    );

    res.status(200).json({ message: "Successfully deleted the deck." });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

module.exports = { createDeck, readDeck, updateDeck, deleteDeck };
