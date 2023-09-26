const jwt = require('jsonwebtoken');
const key='mysecretkey'
const {userModel}=require('../models/userModel')
// const {adminModel} =require(`./../model/adminModel`)


const userAuth=async(req,res,next)=>{
    if(!req.headers.authorization){
        res.status(400).send("provide token")
    }
    else{
        var token=(req.headers.authorization).split(' ')[1]
        if(!token){
        res.status(400).send("token in not available")
        return
        }
        try{
            var decode = jwt.verify(token, key);
            if(!decode.id){
                res.status(404).send("user Id not found")
                return
                }
            var decode = jwt.verify(token, key);
                let resOfUser=await userModel.findById(decode.id)
                // console.log(resOfUser)
                if(resOfUser._id){
                    req.user={
                        id:decode.id,
                        name:resOfUser.name,
                        email:resOfUser.email
                    }
                    return next()
                }else{
                res.status(401).send("Unauthorized user")
                }
               
        }
        catch(e){
            console.log(e)
            res.status(400).send("Invalid Token")
        }
       
}
}
module.exports={
    userAuth
}
