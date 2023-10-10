// const express=require('express')
// const router=express.Router()
// router.use(express.urlencoded({ extended: false }))
// router.use(express.json())


// const user = require('../controller/userController')
// //------ SignUp API ------//
// router.post('/signup',user.signup)
// router.post('/send-otp',user.sendOtp)
// router.post('/verify-otp',user.verifyOTP)
// router.post('/send-email',user.sendEmail)
// router.post('/verify-email',user.verifyEmail)

// //------SignIn API -------//
// router.post('/signin',user.signin)
// router.post('/signin-phone',user.signinPhone)
// router.post('/signin-email',user.signinEmail)
// module.exports=router

const authObj = require("../controller/userController")


module.exports = function () {
    app.all("/*", middle.allowHeaders);
    app.all("/private/*", middle.authenticate);
    /*------------------------------Authentication--------------------------------*/
    app.post("/register-email", authObj.registerWithEmail);
   
    app.post("/login-with-email", authObj.loginWithEmail);
    app.post("/login-with-phone-email", authObj.loginWithPhoneEmail);
  
   
    
    app.post("/register", authObj.register);
    app.post("/login", authObj.loginWithPhone);
   


  

};
