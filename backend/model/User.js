const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    userPassword: {type: String, required:true},
    courses: { type: Array },
    mailBox: { type: Array }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
