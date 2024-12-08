const User = require("../models/User");
const Educator_Student = require("../models/Educator_Student");
const alphabetprogress = require("../models/AlphabetsProgress");
const countingprogress = require("../models/CountingProgress");
const section = require("../models/Section");
exports.getManageEducatorsPage = async (req, res) => {
  try {
    const educators = await User.find({ userType: "Educator" }).select(
      "-password"
    );
    res.render("manage-educator", { educators });
  } catch (error) {
    console.error("Error fetching educators:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteEducator = async (req, res) => {
  const { username } = req.body;
  try {
    await User.deleteOne({ username });
    await Educator_Student.deleteMany({ educatorUsername: username });
    await alphabetprogress.deleteOne({ username });
    await countingprogress.deleteOne({ username });
    await section.deleteMany({ educatorUsername: username });

    res.redirect("/manage-educator");
  } catch (error) {
    console.error("Error deleting educator:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.blockEducator = async (req, res) => {
  const { username } = req.body;
  try {
    await User.updateOne({ username }, { verified: false });
    res.redirect("/manage-educator");
  } catch (error) {
    console.error("Error blocking educator:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.unblockEducator = async (req, res) => {
  const { username } = req.body;
  try {
    await User.updateOne({ username }, { verified: true });
    res.redirect("/manage-educator");
  } catch (error) {
    console.error("Error unblocking educator:", error);
    res.status(500).send("Internal Server Error");
  }
};
