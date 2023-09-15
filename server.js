const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require('express-session');

const passport = require("passport");
// const { loginCheck } = require("./auth/passport");
// loginCheck(passport);

// Mongo DB conncetion
const database = "mongodb+srv://mohitdhimanzeroit:Mohit@023_@cluster0.0pw1i1q.mongodb.net/"

mongoose
  .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Mongodb connect"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

//BodyParsing
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret:'oneboy',
    saveUninitialized: true,
    resave: true
  }));
  

app.use(passport.initialize());
app.use(passport.session());
//Routes
// app.use("/", require("./routes/login"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log("Server has started at port " + PORT));