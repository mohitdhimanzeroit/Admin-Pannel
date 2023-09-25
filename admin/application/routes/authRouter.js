const express = require("express");
const router = express.Router();
const {handleSignin, handleSignup, verifyToken} = require("../controllers/authController");

const { handleChangePassword } = require("../controllers/changeController")


router.post("/signup", handleSignup  )
  
// router.post('/', function (req, res, next) {
//     console.log("User Router Working");
//     res.end();
// });

router.route("/:id/verify/:token").get(verifyToken);

router.route("/signin").post(handleSignin);

router.route("/changepassword").put(handleChangePassword);

module.exports = router;