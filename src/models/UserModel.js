const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user_role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone_no: {
    type: Number,
    required: true,
  },
});

userSchema.methods.matchPassword = async function (loginPassword) {
  return await bcrypt.compare(loginPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified()) {
    next();
  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
