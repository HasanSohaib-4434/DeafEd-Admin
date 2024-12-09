const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

exports.loginPage = (req, res) => {
  res.render("login", { error: null });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  Admin.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.render("login", { error: "Invalid email" });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error(err);
          return res.render("login", {
            error: "An error occurred. Please try again.",
          });
        }

        if (isMatch) {
          req.session.user = user;
          return res.render("adminhome", { user });
        } else {
          return res.render("login", { error: "Incorrect password" });
        }
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("login", {
        error: "An error occurred. Please try again later.",
      });
    });
};

exports.changePassword = async (req, res) => {
  const { newPassword, username } = req.body;
  console.log(username, newPassword);
  if (
    !newPassword ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
      newPassword
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Password does not meet the requirements.",
    });
  }

  try {
    const user = await Admin.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
