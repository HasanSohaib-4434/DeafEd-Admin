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
