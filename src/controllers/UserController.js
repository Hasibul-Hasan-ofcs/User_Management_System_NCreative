const UserModel = require("../models/UserModel");
const { logger } = require("../utilities/Logger");
const {
  generateToken,
  generateLoginToken,
  verifyToken,
} = require("../utilities/JWT");
const {
  signupV,
  loginV,
  updateUserV,
  updateAdminV,
} = require("../middlewares/Validation");
const setMessageByInitiator = require("../../message_service/initiator");
const receiverMessageReceive = require("../../message_service/consumer");

const userSignUp = async (req, res, next) => {
  try {
    let { name, email, password, phone_no, address, user_role } =
      await signupV.validateAsync(req.body);
    const image_name = req.file.filename;

    if (!name || !email || !password || !phone_no || !address) {
      res.status(400);
      throw new Error("Please provide data for all the required field.");
    }

    if (!user_role) {
      user_role = "user";
    }

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists.");
    }

    const user = await UserModel.create({
      name,
      email,
      password,
      phone_no,
      address,
      user_role,
      image_name,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone_no: user.phone_no,
        address: user.address,
        user_role: user.user_role,
        image_name: user.image_name,
        token: generateToken(user._id, user.user_role),
      });
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = await loginV.validateAsync(req.body);

    const user = await UserModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image_name: user.image_name,
        token: generateLoginToken(user._id, user.user_role),
      });

      const userId = user._id;
      receiverMessageReceive(userId); //message queue access
    } else {
      res.status(401);
      const error = new Error("Invalid email or password.");
      next(error);
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await UserModel.find({ _id: { $ne: req.user._id } }); //all users except current user

    if (allUsers) {
      res.status(200).json(allUsers);
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const getAdmin = async (req, res, next) => {
  try {
    const token = req.token || req.headers.authorization;
    const decoded = verifyToken(token);

    const admin = await UserModel.findById(decoded.id);

    if (admin) res.status(200).json(admin);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const token = req.token || req.headers.authorization;
    const decoded = verifyToken(token);

    const user = await UserModel.findById(decoded.id);

    if (user) res.status(200).json(user);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const token = req.token || req.headers.authorization;
    const decoded = verifyToken(token);
    const updateData = await updateUserV.validateAsync(req.body);

    const updatedUser = await UserModel.findByIdAndUpdate(
      decoded.id,
      {
        $set: updateData,
      },
      { new: true }
    );

    if (updatedUser) res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const { id, ...updateData } = await updateAdminV.validateAsync(req.body);
    const token = req.token || req.headers.authorization;
    const decoded = verifyToken(token);
    const updId = id || decoded.id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      updId,
      {
        $set: updateData,
      },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json(updatedUser);
      await setMessageByInitiator(
        updId,
        `User with id: ${updId} was updated at: ${new Date().toLocaleString()}`
      ); //message queue initiation
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const token = req.token || req.headers.authorization;
    const decoded = verifyToken(token);

    const deletedUser = await UserModel.findByIdAndDelete(decoded.id);

    if (deletedUser) res.status(200).send("User deleted successfully");
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const token = req.token || req.headers.authorization;
    const decoded = verifyToken(token);

    const deletedUser = await UserModel.findByIdAndDelete(decoded.id);

    if (deletedUser) res.status(200).send("User deleted successfully");
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (deletedUser) res.status(200).send("User deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
