const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  educatorEmail: {
    type: String,
    required: true,
  },
  educatorUsername: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
    match: /^[A-Za-z]$/,
  },
});

module.exports = mongoose.model("Section", SectionSchema);
