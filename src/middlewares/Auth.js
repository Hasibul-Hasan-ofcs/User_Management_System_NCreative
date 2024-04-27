const { verifyToken } = require("../utilities/JWT");
const { logger } = require("../utilities/Logger");
const UserModel = require("../models/UserModel");

const authentication = async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    try {
      token = req.headers.authorization;

      const decoded = verifyToken(token);

      req.user = await UserModel.findById(decoded.id).select("-password"); //excludes passwords
      req.token = token;

      next();
    } catch (err) {
      res.status(401);
      const error = new Error(
        "Invalid authorization. Token validation failed."
      );
      next(error);
    }
  }

  if (!token) {
    res.status(401);
    const error = new Error("Invalid authorization. No token found.");
    next(error);
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const user = req.user || (await UserModel.findById(req.user._id));

    if (!user.user_role) {
      const error = new Error("No role found");
      next(error);
    }

    if (user.user_role == "admin") {
      next();
    } else {
      const error = new Error("Unauthorized access.");
      res.status(401);
      next(error);
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const isLoggedIn = async (req, res, next) => {
  const token = req.token || req.headers.authorization;
  const decoded = verifyToken(token);

  if (!decoded.login) {
    const error = new Error("Forbidden access.");
    res.status(403);
    next(error);
  }
  next();
};

const isAdminToken = async (req, res, next) => {
  const token = req.token || req.headers.authorization;
  const decoded = verifyToken(token);
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (
    (decoded.role === "user" && user?.user_role === "user") ||
    (decoded.role === "admin" && user?.user_role === "admin")
  ) {
    next();
  } else {
    const error = new Error("Forbidden access. Invalid token usage");
    res.status(403);
    next(error);
  }
};

module.exports = { authentication, verifyAdmin, isLoggedIn, isAdminToken };
