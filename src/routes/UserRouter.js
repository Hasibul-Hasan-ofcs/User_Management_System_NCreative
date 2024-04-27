const express = require("express");
const { userSignUp, userLogin } = require("../controllers/UserController");
const userRouter = express.Router();

userRouter.route("/signup").post(userSignUp);
userRouter.route("/login").post(userLogin);

module.exports = userRouter;
