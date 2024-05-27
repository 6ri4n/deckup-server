const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please create a username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please create a password"],
  },
  decks: [
    {
      deckTitle: String,
      categories: [String],
      flashcards: [
        {
          term: String,
          definition: String,
        },
      ],
    },
  ],
  categories: [
    {
      categoryTitle: String,
    },
  ],
  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
