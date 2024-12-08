const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  usertype: { type: String, default: "admin" },
});

module.exports = mongoose.model("Admin", userSchema);
