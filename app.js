//Include Express, EJS and Mongoose
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

console.log(process.env.API_KEY);

//Declare App as Express Method
const app = express();
//Declare Body Parser
app.use(express.urlencoded({ extended: true }));
//Declare Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

//Declare Model
const User = new mongoose.model("User", userSchema);

//Declare Public static folder
app.use(express.static("public"));
//Make View Engine EJS
app.set("view engine", "ejs");

//Connect to Mongoose Database
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

//Read Routes...
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

//Create routes...
app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  User.findOne({ email: req.body.username }, function (err, filter) {
    if (err) {
      console.log(err);
    } else {
      if (filter) {
        if (filter.password === req.body.password) {
          res.render("secrets");
        } else {
          console.log("Password incorrect. Please try again.");
        }
      } else {
        console.log("Email or password incorrect. Please try again.");
      }
    }
  });
  // if (req.body.username === newUser.email || req.body.password === newUser)
  // res.render("secrets");
});

//Declare lISTEN port
app.listen(3000, function () {
  console.log("Successfuly logged to port 3000.");
});
