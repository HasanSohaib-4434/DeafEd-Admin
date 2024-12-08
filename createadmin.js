const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");

    bcrypt.hash("F219212@a", 10, (err, hashedPassword) => {
      if (err) {
        console.log("Error hashing password:", err);
        return;
      }

      const admin = new User({
        fullname: "Hasan",
        username: "Hasan-kalyar",
        email: "hassankalyar744@gmail.com",
        password: hashedPassword,
        usertype: "admin",
      });

      admin
        .save()
        .then(() => {
          console.log("Admin user created successfully");
          mongoose.connection.close();
        })
        .catch((err) => {
          console.log("Error saving admin user:", err);
          mongoose.connection.close();
        });
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
