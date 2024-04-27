const UserModel = require("../models/UserModel");
const { logger } = require("../utilities/Logger");
const { generateToken } = require("../utilities/JWT");

const userSignUp = async (req, res, next) => {
  try {
    const { name, email, password, phone_no, address, user_role } = req.body;
    const image_name = req.file.filename;

    if (!name || !email || !password || !phone_no || !address || !user_role) {
      res.status(400);
      throw new Error("Please provide data for all the required field.");
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
        password: user.password,
        phone_no: user.phone_no,
        address: user.address,
        user_role: user.user_role,
        image_name: user.image_name,
        token: generateToken(user._id, user.role),
      });
    }
  } catch (error) {
    res.status(400);
    next(error);
    // throw new Error(`Could not create new user`);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image_name: user.image_name,
        token: generateToken(user._id, user.role),
      });
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

module.exports = { userSignUp, userLogin };
