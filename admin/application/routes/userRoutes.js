const express=require('express')
const router=express.Router()
router.use(express.urlencoded({ extended: false }))
router.use(express.json())
const userRoutes=require('../controllers/userController')
const {userAuth} =require('../middlewares/userAuth')

router.post('/signup',userRoutes.signup)
router.get('/register',userRoutes.register)
router.post('/signin',userRoutes.signin)
router.get('/login',userRoutes.login)
router.post('/forgotPassword',userRoutes.forgotPassword)
router.get('/resetpassword',userRoutes.resetpassword)
router.post('/verifyEmail',userRoutes.verifyEmail)

router.post('/validateUser',userRoutes.validateUser)
router.post('/updatePassword',userRoutes.updatePassword)



// router.post('/signup')
module.exports=router
