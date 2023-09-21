// const basePath = require('basePath');

const express = require("express");
const authObj = require(basePath + "/admin/application/controllers/auth"),
    homeObj = require(basePath + "/admin/application/controllers/home")
//   userObj = require(basePath + "/admin/routerlication/controllers/user");
// searchObj = require(basePath + "/admin/routerlication/controllers/user");
// searchObj = require(basePath +
//   "/admin/routerlication/controllers/search");

const router = express.Router();    
router.post("/login", authObj.login);

router.get("/login", homeObj.login);

router.post("/register", authObj.register);

router.get("/register",homeObj.register)
// router.get("/dashboard", homeObj.index);
router.get("/dashboard", homeObj.dashboard); 
// router.get("/admin/create-user", homeObj.insertUserPage);
// router.get("/admin/users-list", homeObj.userListPage);

// router.get("/admin/search-list", homeObj.searchListPage);
//   router.post("/admin/search-list-ajax", searchObj.searchListAjax);
/*------------------------------Users--------------------------------*/
//   router.post("/admin-logout", userObj.adminLogout);
//   router.post("/admin/insert-user", userObj.insertUser);
// router.get("/admin/changePassword", homeObj.changePasswordPage);
//   router.post("/admin/user-list-ajax", userObj.userListAjax);
//   router.post("/admin/delete-user", userObj.deleteUser);
//   router.post("/admin/edit-user", userObj.editUser);
/*------------------------------Reset and forget password--------------------------------*/
  router.get("/resetpassword", homeObj.resetpassword);
  router.get("/forgetpassword", homeObj.forgetpassword);
  router.post("/forgetpassword", authObj.forgetpassword);
  router.post("/resetpassword", authObj.resetpassword);
/* -------------------------Authentication------------------------------*/

// router.post("/activate-account", authObj.activateAccount);
// router.post("/forget-password-email", authObj.userForgotPassword);
// router.post("/admin/reset-admin-password", authObj.userResetPassword);
// router.post("/admin/change-admin-password", authObj.adminChangePassword);
// router.post("/resend-activation-code", authObj.resendActivationCode);
// router.post("/resend-activation-code", authObj.resendActivationCode);
//   router.post("/admin/search-list-ajax", searchObj.searchListAjax);

module.exports = router;
