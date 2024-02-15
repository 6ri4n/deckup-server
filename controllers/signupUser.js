const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const signupUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const foundUsername = await User.findOne({ username });

  if (foundUsername) {
    res.status(400);
    throw new Error("Username not available.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
    });

    res.status(200).json({ message: "Successfully created an account." });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

module.exports = signupUser;
