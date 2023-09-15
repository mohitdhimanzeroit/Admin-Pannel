const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require('express-session');
const path = require('path');
const passport = require("passport");
const { loginCheck } = require("./admin/application/auth/passport");
loginCheck(passport);



// Mongo DB conncetion
const database = "mongodb+srv://mohitdhimanzeroit:Mohit%40023_@cluster0.0pw1i1q.mongodb.net/"

mongoose
  .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Mongodb connect"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
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
app.use("/", require("./admin/application/routes/login"));

const PORT = process.env.PORT || 4111;

app.listen(PORT, console.log("Server has started at port " + PORT));