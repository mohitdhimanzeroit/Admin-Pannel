
const passwordHash = require('password-hash'),
    helper = require('../helper/index'),
    mongoHelper = require('../helper/mongo_helper'),
    authModel = require('../models/auth_model');
    const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

    let authObj = {};
    authObj.login = async  (req, res) => {
        const { email, password } = req.body;

        //Required
        if (!email || !password) {
          console.log("Please fill in all the fields");
          res.render("login", {
            email,
            password,
          });
        } else {
          passport.authenticate("local", {
            successRedirect: "/dashboard",
            failureRedirect: "/login",
            failureFlash: true,
          })(req, res);
        }
    
    }


/**
* Signup Controller
* @param         :
* @returns       :
* @developer     : 
* @modification  :
*/
authObj.register = async  (req, res) => {
    const { name, email, location, password, confirm } = req.body;

  if (!name || !email || !password || !confirm) {
    console.log("Fill empty fields");
  }

  //Confirm Passwords

  if (password !== confirm) {
    console.log("Password must match");
  } else {
    //Validation
    User.findOne({ email: email }).then((user) => {
      if (user) {
        console.log("email exists");
        res.render("register", {
          name,
          email,
          password,
          confirm,
        });
      } else {
        //Validation
        const newUser = new User({
          name,
          email,
          location,
          password,
        });
        //Password Hashing
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then(res.redirect("/login"))
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
  };
  
 
    


/**
* This function is using to 
* @param     : 
* @returns   : 
* @developer : 
*/
// authObj.getUserData = async function (req, res) {

//     let user = helper.getUidByToken(req);

//     if (user && user.userId) {

//         let result = await usersModel.getUserData(user.userId);

//         helper.successHandler(res, {
//             payload: result
//         });

//     } else {

//         helper.errorHandler(res, {
//             code: 'ASL-E1002',
//             message: 'Unauthorized Error.',
//             status: false
//         });

//     }

// }

/**
* Fogot password controller
* @param     :
* @returns   :
* @developer :
*/
authObj.forgetpassword = async function (req, res) {

    let obj = {};

    if (req.body && req.body.email) {

        let row = await authModel.forgetpassword(req.body.email);

        if (row && row.code) {

            obj.code = row.code;

            if (row.code == 'CCS-E1010') {

                obj.message = 'Wrong activation code';
                obj.status = false;

            } else if (row.code == 'CCS-E1013') {

                obj.message = 'Account does not exist';
                obj.status = false;

            } else if (row.code == 'CCS-E1002') {

                obj.message = 'Account exist but not verified';
                obj.status = false;

            }
            helper.errorHandler(res, obj, 500);

        } else {
            helper.successHandler(res, {});
        }
    } else {

        helper.errorHandler(res, {
            code: 'CCS-E2001',
            message: 'All fields are required.',
            status: false
        }, 500);

    }
}

/**
* Reset password controller
* @param     :
* @returns   :
* @developer : 
*/
authObj.resetpassword = async function (req, res) {

    if (req.body.email && req.body.password && req.body.code) {

        let row = await authModel.resetpassword(req.body),
            obj = {};

        if (row && row.code) {

            if (row.code == 'CCS-E1010') {

                obj.message = 'You entered wrong token';
                obj.status = false;

            } else if (row.code == 'CCS-E1013') {

                obj.message = 'Account does not exist';
                obj.status = false;

            } else {

                obj.message = 'Something went wrong.';
                obj.status = false;
            }

            helper.errorHandler(res, obj, 500);

        } else {

            helper.successHandler(res, {
                message: 'Password reset successfully.'
            }, 200);
        }
    } else {

        helper.errorHandler(res, {
            code: 'CCS-E2001',
            message: 'All fields are required.',
            status: false
        }, 500);
    }
}



/**
* Activate user account by entring activation code
* @param     :
* @returns   :
* @developer : 
*/
// authObj.activateAccount = async function (req, res) {

//     if (req.body.email && req.body.token) {

//         let row = await authModel.activateAccount(req.body);

//         if (row && row.code) {

//             let obj = {};
//             obj.code = row.code;

//             if (row.code == 'ZT-E1011') {

//                 obj.message = 'Account already active. Please login with your credentials.';
//                 obj.status = false;

//             } else {

//                 obj.message = 'Wrong activation code';
//                 obj.status = false;

//             }

//             helper.errorHandler(res, obj, 500);

//         } else {
//             helper.successHandler(res, {});
//         }

//     } else {

//         helper.errorHandler(res, {
//             code: 'CCS-E2001',
//             message: 'All fields are required.',
//             status: false
//         }, 500);

//     }

// }

/**
* Reset password controller
* @param     :
* @returns   :
* @developer : 
*/
// authObj.resendActivationCode = async function (req, res) {

//     if (req.body.email) {

//         let row = await authModel.resendActivationCode(req.body.email),
//             obj = {};

//         if (row && row.code) {

//             obj.code = row.code;

//             if (row.code == 'CCS-E1014') {

//                 obj.message = 'Account is already active';
//                 obj.status = false;
//             }

//             helper.errorHandler(res, obj);

//         } else {
//             helper.successHandler(res, {});
//         }

//     } else {

//         helper.errorHandler(res, {
//             code: 'CCS-E2001',
//             message: 'All fields are required.',
//             status: false
//         }, 500);
//     }

// }

/**
* Activate user account by entring activation code
* @param     :
* @returns   :
*/

// authObj.adminChangePassword = async function (req, res) {
//     if (req.body && req.body.password && req.body.currentPassword && req.body.confirmPassword && (req.body.password === req.body.confirmPassword)) {
//         let userId = helper.getUidByToken(req);
//         let results = await authModel.adminChangePassword(req.body, userId);
//         if (results) {
//             helper.successHandler(res, {}, 200);
//         } else {
//             helper.errorHandler(res, {
//                 message: 'Failed, Please try again.'
//             }, 500);
//         }
//     } else {
//         helper.errorHandler(res, {}, 500);
//     }
// };

module.exports = authObj;