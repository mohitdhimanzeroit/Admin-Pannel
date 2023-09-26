
// const passwordHash = require('password-hash'),
//     helper = require('../helper/index'),
//     mongoHelper = require('../helper/mongo_helper'),
//     authModel = require('../models/auth_model');
//     const passport = require("passport");
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const  crypto = require("crypto");
// const nodemailer = require('nodemailer');




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

//     let authObj = {};
//     authObj.login = async  (req, res) => {
//         const { email, password } = req.body;

//         //Required
//         if (!email || !password) {
//           console.log("Please fill in all the fields");
//           res.render("login", {
//             email,
//             password,
//           });
//         } else {
//           passport.authenticate("local", {
//             successRedirect: "/dashboard",
//             failureRedirect: "/login",
//             failureFlash: true,
//           })(req, res);
//         } 
    
//     }


// /**
// * Signup Controller
// * @param         :
// * @returns       :
// * @developer     : 
// * @modification  :
// */
// authObj.register = async  (req, res) => {
//     const { name, email, location, password, confirm } = req.body;

//   if (!name || !email || !password || !confirm) {
//     console.log("Fill empty fields");
//   }

//   //Confirm Passwords

//   if (password !== confirm) {
//     console.log("Password must match");
//   } else {
//     //Validation
//     User.findOne({ email: email }).then((user) => {
//       if (user) {
//         console.log("email exists");
//         res.render("register", {
//           name,
//           email,
//           password,
//           confirm,
//         });
//       } else {
//         //Validation
        
//         const newUser = new User({
//           name,
//           email,
//           location, 
//           password,
//         });
//         // Password Hashing
//         bcrypt.genSalt(10, (err, salt) =>
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;

//             newUser.password = hash;
//             newUser
//               .save()
//               .then(res.redirect("/login"))
//               .catch((err) => console.log(err));
//           })
//         );
//       }
//     });
//   }
//   // let user = await User.findOne({ email: data.email });
//   // if (user) {
//   //   throw new Error("Email already exist", 422);
//   // }
//   // user = new User(data);
//   // const token = JWT.sign({ id: user._id }, JWTSecret);
//   // await user.save();

//   // return (data = {
//   //   userId: user._id,
//   //   email: user.email,
//   //   name: user.name,
//   //   token: token,
//   // });

//   };
  
 
    


// /**
// * This function is using to 
// * @param     : 
// * @returns   : 
// * @developer : 
// */
// // authObj.getUserData = async function (req, res) {

// //     let user = helper.getUidByToken(req);

// //     if (user && user.userId) {

// //         let result = await usersModel.getUserData(user.userId);

// //         helper.successHandler(res, {
// //             payload: result
// //         });

// //     } else {

// //         helper.errorHandler(res, {
// //             code: 'ASL-E1002',
// //             message: 'Unauthorized Error.',
// //             status: false
// //         });

// //     }

// // }

// /**
// * Fogot password controller
// * @param     :
// * @returns   :
// * @developer :
// */
// authObj.forgetpassword = async  (req, res)=> {
// try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).send('User not found');
//     }

//     // Generate a unique token for password reset
//     const token = crypto.randomBytes(32).toString('hex');
//     user.resetToken = token;
//     user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
//     await user.save();

//     // Send a password reset email to the user
//     const resetURL = `http://localhost:8081/resetpassword`;
//     const mailOptions = {
//       to: user.email,
//       from: 'mohitdhiman.zeroit@gmail.com',
//       subject: 'Password Reset Request',
//       html: `
//         <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
//         <p>Please click on the following link to reset your password:</p>
//         <a href="${resetURL}">${resetURL}</a>
//         <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//     res.send('Password reset email sent');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Password reset request failed');
//   }
  
// }

// /**
// * Reset password controller
// * @param     :
// * @returns   :
// * @developer : 
// */
// authObj.resetpassword = async  (req, res) => {
//   try {
//     const token = req.params.token;
//     const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

//     if (!user) {
//       return res.send('Invalid or expired reset token');
//     }

//     res.render('resetpassword', { token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error rendering reset password form');
//   }
// }
// //reset-password post request//
// authObj.resetpasswordtoken = async  (req, res) => {
//   try {
//     const token = req.params.token;
//     const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

//     if (!user) {
//       return res.send('Invalid or expired reset token');
//     }

//     const { password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//       console.log(password)
//     // Update the user's password and clear the reset token fields
//     user.password = hashedPassword;
//     user.resetToken = undefined;
//     user.resetTokenExpiration = undefined;
    
//     // Save the updated user object to MongoDB
//     await user.save();

//     res.send('Password reset successful');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Password reset failed');
//   }


    
  
// };


// /**
// * Activate user account by entring activation code
// * @param     :
// * @returns   :
// * @developer : 
// */
// // authObj.activateAccount = async function (req, res) {

// //     if (req.body.email && req.body.token) {

// //         let row = await authModel.activateAccount(req.body);

// //         if (row && row.code) {

// //             let obj = {};
// //             obj.code = row.code;

// //             if (row.code == 'ZT-E1011') {

// //                 obj.message = 'Account already active. Please login with your credentials.';
// //                 obj.status = false;

// //             } else {

// //                 obj.message = 'Wrong activation code';
// //                 obj.status = false;

// //             }

// //             helper.errorHandler(res, obj, 500);

// //         } else {
// //             helper.successHandler(res, {});
// //         }

// //     } else {

// //         helper.errorHandler(res, {
// //             code: 'CCS-E2001',
// //             message: 'All fields are required.',
// //             status: false
// //         }, 500);

// //     }

// // }

// /**
// * Reset password controller
// * @param     :
// * @returns   :
// * @developer : 
// */
// // authObj.resendActivationCode = async function (req, res) {

// //     if (req.body.email) {

// //         let row = await authModel.resendActivationCode(req.body.email),
// //             obj = {};

// //         if (row && row.code) {

// //             obj.code = row.code;

// //             if (row.code == 'CCS-E1014') {

// //                 obj.message = 'Account is already active';
// //                 obj.status = false;
// //             }

// //             helper.errorHandler(res, obj);

// //         } else {
// //             helper.successHandler(res, {});
// //         }

// //     } else {

// //         helper.errorHandler(res, {
// //             code: 'CCS-E2001',
// //             message: 'All fields are required.',
// //             status: false
// //         }, 500);
// //     }

// // }

// /**
// * Activate user account by entring activation code
// * @param     :
// * @returns   :
// */

// // authObj.adminChangePassword = async function (req, res) {
// //     if (req.body && req.body.password && req.body.currentPassword && req.body.confirmPassword && (req.body.password === req.body.confirmPassword)) {
// //         let userId = helper.getUidByToken(req);
// //         let results = await authModel.adminChangePassword(req.body, userId);
// //         if (results) {
// //             helper.successHandler(res, {}, 200);
// //         } else {
// //             helper.errorHandler(res, {
// //                 message: 'Failed, Please try again.'
// //             }, 500);
// //         }
// //     } else {
// //         helper.errorHandler(res, {}, 500);
// //     }
// // };

// module.exports = authObj;