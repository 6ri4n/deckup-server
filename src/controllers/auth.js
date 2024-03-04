const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../database/models/user");
const asyncHandler = require("../utils/asyncHandler");

const signupUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory.");
  }

  try {
    const foundUsername = await User.findOne({ username });

    if (foundUsername) {
      res.status(400);
      throw new Error("Username not available.");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
    });

    res.status(200).json({ message: "Successfully created an account." });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  try {
    const foundUser = await User.findOne({ username });

    if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
      const expiresInRefreshToken =
        process.env.NODE_ENV === "production" ? "2d" : "2m";

      const refreshToken = jwt.sign(
        {
          userId: foundUser._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: expiresInRefreshToken }
      );

      const expiresInAccessToken =
        process.env.NODE_ENV === "production" ? "15m" : "1m";

      const accessToken = jwt.sign(
        {
          username: foundUser.username,
          id: foundUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: expiresInAccessToken }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Enable this in production when using HTTPS
        signed: true,
        sameSite: "strict",
      });

      res.status(200).json({
        userId: foundUser._id,
        username: foundUser.username,
        accessToken,
      });
    } else {
      res.status(401);
      throw new Error("Incorrect username or password.");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true });
  res.status(200).send("Logged out successfully.");
});

const refreshUser = asyncHandler(async (req, res) => {
  const cookies = req.signedCookies;

  if (!cookies?.refreshToken) {
    res.status(401);
    throw new Error("Unauthorized.");
  }

  const refreshToken = cookies.refreshToken;
  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const now = Date.now() / 1000; // Convert to seconds
    if (!payload.exp || payload.exp <= now) {
      res.status(403);
      throw new Error("Unauthorized: Token has expired.");
    }
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(403);
      throw new Error("Unauthorized: Token is invalid.");
    } else if (error.name === "TokenExpiredError") {
      res.status(403);
      throw new Error("Unauthorized: Token has expired.");
    } else {
      res.status(500);
      throw new Error(err.message);
    }
  }

  try {
    const foundUser = await User.findOne({ _id: payload.userId });

    if (!foundUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    const expiresInAccessToken =
      process.env.NODE_ENV === "production" ? "15m" : "1m";

    const accessToken = jwt.sign(
      {
        username: foundUser.username,
        id: foundUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: expiresInAccessToken,
      }
    );

    res.status(200).json({
      userId: foundUser._id,
      username: foundUser.username,
      accessToken,
    });
  } catch (error) {
    res.status(500);
    throw new Error(err.message);
  }
});

module.exports = { signupUser, loginUser, logoutUser, refreshUser };
