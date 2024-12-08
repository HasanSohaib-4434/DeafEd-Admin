const User = require("../models/User");

// Get all students
exports.getManageStudentsPage = async (req, res) => {
  try {
    const students = await User.find({ userType: "Student" }).select(
      "-password"
    );
    res.render("manage-student", { students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  const { username } = req.body;
  try {
    await User.deleteOne({ username });
    res.redirect("/manage-student");
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Block a student
exports.blockStudent = async (req, res) => {
  const { username } = req.body;
  try {
    await User.updateOne({ username }, { verified: false });
    res.redirect("/manage-student");
  } catch (error) {
    console.error("Error blocking student:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Unblock a student
exports.unblockStudent = async (req, res) => {
  const { username } = req.body;
  try {
    await User.updateOne({ username }, { verified: true });
    res.redirect("/manage-student");
  } catch (error) {
    console.error("Error unblocking student:", error);
    res.status(500).send("Internal Server Error");
  }
};
