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
      deckId: String,
      deckTitle: String,
      flashcards: [
        {
          cardId: String,
          term: String,
          definition: String,
          termImageURL: String,
          definitionImageURL: String,
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
