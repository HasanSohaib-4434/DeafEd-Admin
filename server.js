const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Models
const User = require("./models/User");

// Routes
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", require("./controllers/authController").login);
app.get("/forgetpassword", (req, res) => {
  res.render("forgetpassword");
});
app.post("/forgetpassword", require("./controllers/authController").sendOTP);
app.post(
  "/resetpassword",
  require("./controllers/authController").resetPassword
);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
