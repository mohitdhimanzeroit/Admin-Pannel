
const authObj = require(basePath + "/admin/application/controller/auth"),
  homeObj = require(basePath + "/admin/application/controller/home"),
  userObj = require(basePath + "/admin/application/controller/user");
searchObj = require(basePath + "/admin/application/controller/user");
searchObj = require(basePath +
  "/admin/application/controller/search");

module.exports = function () {
  app.post("/admin/login", authObj.login);
  app.get("/admin", homeObj.adminLogin);
  app.get("/admin/dashboard", homeObj.index);
  app.get("/admin/create-user", homeObj.insertUserPage);
  app.get("/admin/users-list", homeObj.userListPage);

  app.get("/admin/search-list", homeObj.searchListPage);
  app.post("/admin/search-list-ajax", searchObj.searchListAjax);
  /*------------------------------Users--------------------------------*/
  app.post("/admin-logout", userObj.adminLogout);
  app.post("/admin/insert-user", userObj.insertUser);
  app.get("/admin/changePassword", homeObj.changePasswordPage);
  app.post("/admin/user-list-ajax", userObj.userListAjax);
  app.post("/admin/delete-user", userObj.deleteUser);
  app.post("/admin/edit-user", userObj.editUser);
  /*------------------------------Reset and forget password--------------------------------*/
  app.get("/admin/reset-password", homeObj.resetpwdScreen);
  app.get("/admin/forgot-password", homeObj.forgetpasswordScreen);
  /* -------------------------Authentication------------------------------*/
  app.post("/register", authObj.register);
  app.post("/activate-account", authObj.activateAccount);
  app.post("/forget-password-email", authObj.userForgotPassword);
  app.post("/admin/reset-admin-password", authObj.userResetPassword);
  app.post("/admin/change-admin-password", authObj.adminChangePassword);
  app.post("/resend-activation-code", authObj.resendActivationCode);
  app.post("/resend-activation-code", authObj.resendActivationCode);
  app.post("/admin/search-list-ajax", searchObj.searchListAjax);
};
