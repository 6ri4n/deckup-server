const User = require("../database/models/user");
const asyncHandler = require("../utils/asyncHandler");

const createDeck = asyncHandler(async (req, res) => {
  const {
    deck: newDeck,
    user: { id: userId },
  } = req.body;

  if (!newDeck) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  if (newDeck.flashcards.length > 24) {
    res.status(400);
    throw new Error("Deck must not exceed 24 cards.");
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
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const readDeck = asyncHandler(async (req, res) => {
  const {
    user: { id: userId },
  } = req.body;

  const { id, category } = req.query;

  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    if (id) {
      const foundDeck = await User.findOne(
        {
          _id: userId,
          "decks._id": id,
        },
        {
          "decks.$": 1,
        }
      );

      if (!foundDeck) {
        res.status(404);
        throw new Error("Deck not found.");
      }

      res.status(200).json({ deck: foundDeck });
    } else if (category) {
      const foundDeck = foundUser.decks.filter((deck) =>
        deck.categories.includes(category)
      );
      res.status(200).json({ decks: foundDeck });
    } else {
      res.status(200).json({ decks: foundUser.decks });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const updateDeck = asyncHandler(async (req, res) => {
  const {
    _id: deckId,
    deck: updatedDeck,
    user: { id: userId },
  } = req.body;

  if (!deckId || !updatedDeck) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  if (updatedDeck.flashcards.length > 24) {
    res.status(400);
    throw new Error("Deck must not exceed 24 cards.");
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
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const deleteDeck = asyncHandler(async (req, res) => {
  const {
    user: { id: userId },
  } = req.body;

  const { id } = req.query;

  if (!id) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    const foundDeck = await User.findOne({ _id: userId, "decks._id": id });

    if (!foundDeck) {
      res.status(404);
      throw new Error("Deck not found.");
    }

    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { decks: { _id: id } } },
      { new: true }
    );

    res.status(200).json({ message: "Successfully deleted the deck." });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = { createDeck, readDeck, updateDeck, deleteDeck };
