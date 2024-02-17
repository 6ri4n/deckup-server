const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user");

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
    res.status(401);
    throw new Error("Incorrect username or password.");
  }
});

module.exports = logoutUser;
