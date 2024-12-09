const User = require("../models/User");
const Section = require("../models/Section");
const Educator_Student = require("../models/Educator_Student");
exports.getManageSectionsPage = async (req, res) => {
  const { educatorUsername } = req.query;
  try {
    const educators = await User.find({ userType: "Educator" }).select(
      "username email"
    );
    const sections = educatorUsername
      ? await Section.find({ educatorUsername })
      : [];

    res.render("manage-section", {
      educators,
      selectedEducator: educatorUsername || "",
      sections,
      selectedSection: null,
      students: null,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteSection = async (req, res) => {
  const { section, educatorUsername } = req.body;
  try {
    await Section.deleteOne({ section, educatorUsername });
    await Educator_Student.deleteMany({ section, educatorUsername });
    res.redirect("/manage-sections");
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.viewStudentsInSection = async (req, res) => {
  const { educatorUsername, section } = req.query;

  try {
    const educators = await User.find({ userType: "Educator" }).select(
      "username email"
    );

    const sections = await Section.find({ educatorUsername });

    let students = [];
    if (section) {
      const studentData = await Educator_Student.find({
        educatorUsername,
        section,
      });

      students = await User.find({
        userType: "Student",
        username: { $in: studentData.map((data) => data.studentUsername) },
      });
    }

    res.render("manage-section", {
      educators,
      selectedEducator: educatorUsername,
      sections,
      selectedSection: section || null,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Internal Server Error");
  }
};
exports.removeStudentFromSection = async (req, res) => {
  const { section, studentUsername } = req.body;

  try {
    await Educator_Student.deleteOne({ section, studentUsername });

    res.redirect(
      `/manage-sections/view?educatorUsername=${req.body.educatorUsername}&section=${section}`
    );
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).send("Internal Server Error");
  }
};
