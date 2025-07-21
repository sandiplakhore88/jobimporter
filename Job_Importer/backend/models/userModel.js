const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema(
  {
    userUuid: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },

    userName: {
      type: String,
      required:true,
    },

    email: {
      type: String,
      required: false,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Admin"],
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("users", UserSchema);

module.exports = { UserModel };
