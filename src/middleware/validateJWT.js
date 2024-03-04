const jwt = require("jsonwebtoken");

const validateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403);
    throw new Error("Unauthorized: Token is invalid or empty.");
  }

  const accessToken = authHeader.substring(7);
  let payload;

  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

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
      throw new Error("Internal Server Error.");
    }
  }

  req.body.user = payload;

  next();
};

module.exports = validateJWT;
