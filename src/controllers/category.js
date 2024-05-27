const User = require("../database/models/user");
const asyncHandler = require("../utils/asyncHandler");

const readCategory = asyncHandler(async (req, res) => {
  const {
    user: { id: userId },
  } = req.body;

  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    res.status(200).json({ categories: foundUser.categories });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const createCategory = asyncHandler(async (req, res) => {
  const {
    user: { id: userId },
    category,
  } = req.body;

  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { categories: category } },
      { new: true }
    );

    res.status(200).json({ message: "Successfully created a new category." });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const {
    user: { id: userId },
    _id: categoryId,
    category,
  } = req.body;

  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    await User.findOneAndUpdate(
      { _id: userId, "categories._id": categoryId },
      { $set: { "categories.$": category } },
      { new: true }
    );

    res.status(200).json({ message: "Successfully updated the category." });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
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

    const foundCategory = await User.findOne({
      _id: userId,
      "categories._id": id,
    });

    if (!foundCategory) {
      res.status(404);
      throw new Error("Category not found.");
    }

    const updatedDeck = foundUser.decks.map((deck) => {
      if (deck.categories.includes(id)) {
        return {
          ...deck,
          categories: deck.categories.filter((categoryId) => categoryId !== id),
        };
      }

      return deck;
    });

    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { decks: updatedDeck } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { categories: { _id: id } } },
      { new: true }
    );

    res.status(200).json({ message: "Successfully deleted the category." });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  readCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
