// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const session = require('express-session');
// const path = require('path');
// const passport = require("passport");
// const jwt = require("jsonwebtoken");
// const nodemailer = require('nodemailer');
// const bcrypt = require('bcrypt');
// const ejs = require('ejs');
// // const transporter = require('transporter')

// const { loginCheck } = require("./admin/application/auth/passport");
// loginCheck(passport);

// app.set("port", process.env.PORT || 8081);
// global.app = app;
// global.jwt = jwt;
// global.basePath = __dirname;

// // Mongo DB conncetion
// const database = "mongodb+srv://mohitdhimanzeroit:Mohit%40023_@cluster0.0pw1i1q.mongodb.net/"

// mongoose
//   .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
//   .then(() => console.log("Mongodb connect"))
//   .catch((err) => console.log(err));

// // Set up Nodemailer for sending emails
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: "mohitdhiman.zeroit@gmail.com",
//     pass: "ptqc vgnm lskb lgaq" 
//   }
// });

// // app.set("view engine", "ejs");
// // app.set('views', path.join(__dirname, 'views'));
// //BodyParsing
// app.use(express.urlencoded({ extended: false }));
// app.use(session({
//   secret: 'oneboy',
//   saveUninitialized: true,
//   resave: true
// }));


// app.use(passport.initialize());
// app.use(passport.session());
// //Routes
// app.use("/", require("./admin/application/routes/index"));
// // app.get("/",(req,res)=>{
// //   res.render(__dirname + "views")
// // })


// app.use(express.static(__dirname + ""));
// app.set("views", [
//   path.join(__dirname, "admin/application/views"),

// ]);
// app.set("view engine", "ejs");

// // require("./app")();
// // require("./admin")()


// const PORT = process.env.PORT || 8081;

// app.listen(PORT, console.log("Server has started at port " + PORT));
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const userRoutes = require("../Admin-Pannel/admin/application/routes/userRoutes");
const AppError = require("../Admin-Pannel/admin/application/utils/error");
const errorHandler = require("../Admin-Pannel/admin/application/middlewares/errorHandler");

const app = express();

mongoose
  .connect("mongodb+srv://mohitdhimanzeroit:Mohit%40023_@cluster0.0pw1i1q.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("> DB connection successful ... ");
  });

app.use(express.json());

app.use("/api/users", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

const PORT = 8081;

app.listen(PORT, () => {
  console.log(`> App running on port ${PORT} ...`);
});