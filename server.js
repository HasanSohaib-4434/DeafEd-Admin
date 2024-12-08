const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const session = require("express-session");
const manageStudentsController = require("./controllers/manageStudentController");
const manageEducatorsController = require("./controllers/manageEducatorsController");
const manageSectionsController = require("./controllers/manageSectionsController");
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const authController = require("./controllers/authController");

app.get("/", authController.loginPage);
app.get("/login", authController.loginPage);
app.post("/login", authController.login);

app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Unable to log out");
      } else {
        res.redirect("/login");
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/manage-class", (req, res) => {
  res.render("manage-class");
});

app.get("/manage-student", manageStudentsController.getManageStudentsPage);

app.post("/manage-students/delete", manageStudentsController.deleteStudent);

app.post("/manage-students/block", manageStudentsController.blockStudent);

app.post("/manage-students/unblock", manageStudentsController.unblockStudent);

app.get("/manage-educator", manageEducatorsController.getManageEducatorsPage);

app.post("/manage-educators/delete", manageEducatorsController.deleteEducator);

app.post("/manage-educators/block", manageEducatorsController.blockEducator);

app.post(
  "/manage-educators/unblock",
  manageEducatorsController.unblockEducator
);

app.get("/manage-section", manageSectionsController.getManageSectionsPage);
app.get("/manage-sections", manageSectionsController.getManageSectionsPage);

app.post("/manage-sections/delete", manageSectionsController.deleteSection);
app.get(
  "/manage-sections/view",
  manageSectionsController.viewStudentsInSection
);
app.post(
  "/manage-sections/remove-student",
  manageSectionsController.removeStudentFromSection
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
