const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const foundUser = await User.findOne({ username });

  if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
    const expiresInRefreshToken =
      process.env.NODE_ENV === "production" ? "1d" : "1m";

    const refreshToken = jwt.sign(
      {
        user: {
          username: foundUser.username,
          id: foundUser._id,
        },
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: expiresInRefreshToken }
    );

    await User.findOneAndUpdate({ username }, { refreshToken });

    const expiresInAccessToken =
      process.env.NODE_ENV === "production" ? "30m" : "15s";

    const accessToken = jwt.sign(
      {
        user: {
          username: foundUser.username,
          id: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: expiresInAccessToken }
    );

    res.status(200).json({ userId: foundUser._id, accessToken });
  } else {
    res.status(401);
    throw new Error("Incorrect username or password.");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const foundUser = await User.findOne({ _id: userId });

  if (foundUser) {
    await User.findOneAndUpdate({ _id: userId }, { refreshToken: "" });

    res
      .status(200)
      .json({ title: "Logout", message: "Successfully logged out." });
  } else {
    res.status(500);
    throw new Error(err.message);
  }
});

module.exports = { signupUser, loginUser, logoutUser };
