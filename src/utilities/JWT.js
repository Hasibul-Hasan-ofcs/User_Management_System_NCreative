const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "60d",
  });
};

const verifyToken = () => {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      return decodedToken;
    }
  });
};

module.exports = { generateToken, verifyToken };
