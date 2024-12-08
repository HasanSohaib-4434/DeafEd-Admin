const mongoose = require("mongoose");

const CountingProgressSchema = new mongoose.Schema({
  username: { type: String, required: true },
  openedNumbers: { type: [Number], default: [] },
});

module.exports = mongoose.model("CountingProgress", CountingProgressSchema);
