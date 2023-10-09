const express=require('express')
const router=express.Router()
router.use(express.urlencoded({ extended: false }))
router.use(express.json())


const user = require('../controller/userController')

router.post('/signup',user.signup)
router.post('/verify-otp',user.verifyOTP)
router.post('/send-email',user.sendEmail)

module.exports=router