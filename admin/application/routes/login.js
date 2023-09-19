const express = require("express");

const {
  registerView,
  loginView,
  registerUser,
  loginUser,
} = require("../controllers/loginController");
const { dashboardView } = require("../controllers/dashboardController");
const { protectRoute } = require("../auth/protect");
const { forgetpasswordView, resetpasswordView } = require("../controllers/passwordController");
const { createuserView, userslistView } = require("../controllers/userController");

const router = express.Router();

router.get("/register", registerView);
router.get("/login", loginView);
router.get("/forgetpassword",forgetpasswordView);
router.get("/resetpassword",resetpasswordView)
router.get("/createuser",createuserView);
router.get("/userslist",userslistView)
//Dashboard
router.get("/dashboard", protectRoute, dashboardView);

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;