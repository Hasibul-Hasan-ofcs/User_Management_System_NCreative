const express = require("express");
const { user } = require("../controllers/UserController");
const userRouter = express.Router();

userRouter.route("/").get(user);

module.exports = userRouter;
