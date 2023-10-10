const express=require('express')
const router=express.Router()
router.use(express.urlencoded({ extended: false }))
router.use(express.json())


const user = require('../controller/userController')
//------ SignUp API ------//
router.post('/signup',user.signup)
router.post('/verify-otp',user.verifyOTP)
router.post('/send-email',user.sendEmail)
router.post('/verify-email',user.verifyEmail)
module.exports=router