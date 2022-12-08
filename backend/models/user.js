const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please, enter your full name"],
    },
    email: {
      type: String,
      required: [true, "Please, enter your email"],
    },
    password: {
      type: String,
      required: [true, "Please, enter your password"],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
