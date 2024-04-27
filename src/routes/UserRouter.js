const express = require("express");
const {
  userSignUp,
  userLogin,
  getAllUsers,
  getAdmin,
  getUser,
  updateUser,
  updateAdmin,
  deleteUser,
  deleteAdmin,
  deleteById,
} = require("../controllers/UserController");
const {
  authentication,
  verifyAdmin,
  isLoggedIn,
  isAdminToken,
} = require("../middlewares/Auth");
const userRouter = express.Router();

userRouter.route("/signup").post(userSignUp);
userRouter.route("/login").post(isAdminToken, userLogin);
userRouter
  .route("/all-users")
  .get(authentication, verifyAdmin, isLoggedIn, getAllUsers);
userRouter
  .route("/admin")
  .get(authentication, verifyAdmin, isLoggedIn, getAdmin);
userRouter
  .route("/admin")
  .put(authentication, verifyAdmin, isLoggedIn, updateAdmin);
userRouter
  .route("/admin")
  .delete(authentication, verifyAdmin, isLoggedIn, deleteAdmin);
userRouter
  .route("/admin/:id")
  .delete(authentication, verifyAdmin, isLoggedIn, deleteById);
userRouter.route("/").get(authentication, isLoggedIn, getUser);
userRouter.route("/").put(authentication, isLoggedIn, updateUser);
userRouter.route("/").delete(authentication, isLoggedIn, deleteUser);

module.exports = userRouter;
