const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

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

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Incorrect username or password.");
  }
});

module.exports = loginUser;
