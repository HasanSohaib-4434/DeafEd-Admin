const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Login Controller
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) return res.send("User not found");

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return res.render("adminhome", { user });
        } else {
          return res.send("Incorrect password");
        }
      });
    })
    .catch((err) => console.log(err));
};

// Forget Password Controller
exports.sendOTP = (req, res) => {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) return res.send("User not found");

      const otp = Math.floor(100000 + Math.random() * 900000);

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          return res.send("Error sending OTP");
        }
        return res.render("forgetpassword", { otp });
      });
    })
    .catch((err) => console.log(err));
};

// Reset Password Controller
exports.resetPassword = (req, res) => {
  const { email, otp, newPassword } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) return res.send("User not found");

      if (otp !== req.body.otp) {
        return res.send("Invalid OTP");
      }

      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) throw err;

        user.password = hashedPassword;
        user
          .save()
          .then(() => res.send("Password successfully updated"))
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
};
