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
    // Find all educators
    const educators = await User.find({ userType: "Educator" }).select(
      "username email"
    );

    // Find all sections for the educator
    const sections = await Section.find({ educatorUsername });

    // If a section is provided, fetch students in that specific section
    let students = [];
    if (section) {
      // Get the students from Educator_Student model for that section
      const studentData = await Educator_Student.find({
        educatorUsername,
        section,
      });

      // Extract the student usernames from the result
      students = await User.find({
        userType: "Student",
        username: { $in: studentData.map((data) => data.studentUsername) },
      });
    }

    res.render("manage-section", {
      educators,
      selectedEducator: educatorUsername,
      sections, // Display all sections of the educator
      selectedSection: section || null, // If a section is selected, show it, otherwise null
      students, // Show the students only for the selected section
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Internal Server Error");
  }
};
exports.removeStudentFromSection = async (req, res) => {
  const { section, studentUsername } = req.body;

  try {
    // Remove the student from the Educator_Student collection based on educatorUsername and section
    await Educator_Student.deleteOne({ section, studentUsername });

    // Redirect to the manage-sections view after the student has been removed
    res.redirect(
      `/manage-sections/view?educatorUsername=${req.body.educatorUsername}&section=${section}`
    );
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).send("Internal Server Error");
  }
};
