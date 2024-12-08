const mongoose = require("mongoose");

const AlphabetsProgressSchema = new mongoose.Schema({
  username: { type: String, required: true },
  openedLetters: { type: [String], default: [] },
});

module.exports = mongoose.model("AlphabetsProgress", AlphabetsProgressSchema);
