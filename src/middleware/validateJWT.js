const jwt = require("jsonwebtoken");

const validateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403);
    throw new Error("Unauthorized: token is invalid or empty");
  }

  const token = authHeader.substring(7);
  let payload;

  try {
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    res.status(403);
    throw new Error("Unauthorized: token does not match");
  }

  const now = Date.now() / 1000; // Convert to seconds
  if (!payload.exp || payload.exp <= now) {
    res.status(403);
    throw new Error("Unauthorized: token has expired");
  }

  req.body.user = payload;

  next();
};

module.exports = validateJWT;
