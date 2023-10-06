const helper = require("../helpers/index"),
  userModel = require("../models/user_model");

let userObj = {};

/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
userObj.insertUser = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {

      if (req && req.body && req.body.userName && req.body.userEmail && req.body.userPassword 
        && req.body.userGender && req.body.userNumber && req.body.userCountry) {

      let result = await userModel.insertUser(req.body, user.userId);
      helper.successHandler(res, {});

    } else {
      helper.errorHandler(res, {
        code: "ASL-E1002",
        message: "Please fill manadatory fields.",
        status: false,
      });
    }
  } else {
    helper.errorHandler(res, {
      code: "ASL-E1002",
      message: "Unauthorized Error.",
      status: false,
    });
  }
};



/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
// userObj.userListAjax = async function (req, res) {
//   let user = helper.getUidByToken(req);

//   if (user && user.userId) {
//     let result = await userModel.getuserlist(req.body);
//     res.render("userListAjax", {
//       req: req,
//       data: result,
//     });
//   } else {
//     helper.errorHandler(res, {
//       code: "ASL-E1002",
//       message: "Unauthorized Error.",
//       status: false,
//     });
//   }
// };
/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
// userObj.deleteUser = async function (req, res) {
//   let user = helper.getUidByToken(req);

//   if (user && user.userId) {

//     if (req && req.body && req.body.userId) {

//       let result = await userModel.deleteuser(req.body, user.userId);

//       helper.successHandler(res, {});

//     } else {
//       helper.errorHandler(res, {
//         code: "ASL-E1002",
//         message: "Please fill manadatory fields.",
//         status: false,
//       });
//     }

//   } else {

//     helper.errorHandler(res, {
//       code: "ASL-E1002",
//       message: "Unauthorized Error.",
//       status: false,
//     });

//   }

// };

/**
 * This is using to
 * @param       :
 * @returns     :
 * @developer   :
 */
// userObj.editUser = async function (req, res) {
//   let user = helper.getUidByToken(req);

//   if (user && user.userId) {
//     if (req && req.body && req.body.userId) {
//       let result = await userModel.editUser(req.body, user.userId);

//       helper.successHandler(res, {});
//     } else {
//       helper.errorHandler(res, {
//         code: "ASL-E1002",
//         message: "Please fill manadatory fields.",
//         status: false,
//       });
//     }
//   } else {
//     helper.errorHandler(res, {
//       code: "ASL-E1002",
//       message: "Unauthorized Error.",
//       status: false,
//     });
//   }
// };


/**
 * This is using to
 * @param       :
 * @returns     :
 * @developer   :
 */
// userObj.adminLogout = async function (req, res) {
//   res.clearCookie('token');
//   helper.successHandler(res, {});

// };

module.exports = userObj;
