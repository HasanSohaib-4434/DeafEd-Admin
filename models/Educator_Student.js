const mongoose = require("mongoose");

const EducatorStudentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    match: /^[A-Z]$/,
  },
  educatorUsername: {
    type: String,
    required: true,
  },
  educatorEmail: {
    type: String,
    required: true,
    match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  studentUsername: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Educator_Student", EducatorStudentSchema);
