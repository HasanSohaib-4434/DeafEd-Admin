const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z][a-zA-Z0-9]*$/.test(v);
      },
      message: "Username must be alphanumeric and start with an alphabet.",
    },
  },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  dob: { type: Date, required: false },
  fullname: { type: String, required: true },
  verified: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
