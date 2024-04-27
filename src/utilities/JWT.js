const jwt = require("jsonwebtoken");
const { logger } = require("./Logger");
require("dotenv").config();

const generateToken = (id, role) => {
  return jwt.sign({ role, id }, process.env.JWT_SECRET, {
    expiresIn: "60d",
  });
};

const generateLoginToken = (id, role) => {
  return jwt.sign({ role, id, login: true }, process.env.JWT_SECRET, {
    expiresIn: "60d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return new Error("Invalid token");
    } else {
      return decodedToken;
    }
  });
};

module.exports = { generateToken, generateLoginToken, verifyToken };
