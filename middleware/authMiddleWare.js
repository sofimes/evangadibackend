const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function authMiddleWare(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Authentication invalid: No or malformed token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      throw new Error("Internal server error");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username: decoded.username, userid: decoded.userid };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication invalid" });
  }
}

module.exports = authMiddleWare;
