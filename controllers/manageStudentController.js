const User = require("../models/User");
const Educator_Student = require("../models/Educator_Student");
const alphabetprogress = require("../models/AlphabetsProgress");
const countingprogress = require("../models/CountingProgress");
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

exports.deleteStudent = async (req, res) => {
  const { username } = req.body;
  try {
    await User.deleteOne({ username });
    await Educator_Student.deleteMany({ studentUsername: username });
    await alphabetprogress.deleteOne({ username });
    await countingprogress.deleteOne({ username });

    res.redirect("/manage-student");
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).send("Internal Server Error");
  }
};

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
