// const createuserView = (req, res) => {
//     res.render("createuser", {});
//   };

//   const userslistView = (req, res) => {
//     res.render("userslist", {});
//   };
//   module.exports = {
//     createuserView,
//     userslistView
//   };
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const request = require("request");
dotenv.config();
const crypto = require('crypto');
const key = process.env.JWT_KEY;
const flash = require('connect-flash')
const saltRounds = 10;
const FRONT_END_URL = process.env.FRONT_END_URL;
const { sendEmail } = require("../helper/SendEmail");
const { userModel } = require("../models/userModel");
const{userAuth} = require("../middlewares/userAuth")
const login = async  (req, res) =>{
  res.render("login", { error:null });
};
const register = async  (req, res) =>{
  res.render("register", {

  });
};

const resetpassword = async  (req, res) =>{
  const foundUser =  await userModel.findOne({updatePasswordToken: req.query.token});
    if (!foundUser) {
      res.json({data: "expire"})
    }else{

    
  console.log(req.query)
  res.render("resetpassword", {
      userId: foundUser?._id
  });
}
}
const changepassword = async  (req, res) =>{
  res.render("changepassword", {

  });
}

const dashboard = async  (req, res) =>{
  res.render("dashboard", {

  });
}
const signup = async (req, res) => {
  userData = req.body;
  console.log(userData);
  userData.created_at = new Date();
  if (!userData.email || !userData.password) {
    res.status(400).send("Username and Password are mandatory");
    return;
  }
  if (userData.password?.length < 8) {
    res.status(400).send("Password should be minimum 8 Charecter");
    return;
  }
  let userNameResult = await userModel.find({
    email: userData.email,
    isVerified: true,
  });
  console.log(userNameResult);
  if (userNameResult.length > 0) {
    res.status(400).send(`Email already exist`);
    return;
  }
  let hashPassword = await passwordEncyption(userData.password);
  userData.password = hashPassword;
  userData.emailIdentifier = userData.email
  const createResult = await userModel.create(userData);
  console.log(createResult)
  if (createResult) {
    try {
      var token = jwt.sign({ id: createResult._id }, key);
      console.log(token)
      let url = `http://localhost:8081/users/login??confirmEmail?link=${token}`;
      console.log(url)
      // let html = `<a href=${url}>click here</a> to Reset Your password`
      let html = `

            <div style="font-family: Helvetica,Arial,sans-serif;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"><img src="https://project1-xi-woad.vercel.app/assets/images/FTnew.png" /></a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>You are receiving this because you (or someone else) have requested the create account on this email. 
                Please click on the following link, or paste this into your browser to complete the process: 
                <a href=${url}>click here</a> to confirm your email.
                'If you did not request this, please ignore this email.\n</p>
                </div>
            </div>
            `;
          console.log(html)
      let r = await sendEmail(
        userData.email,
        html,
        " Admin || Confirm Email"
      );
      console.log(r)
      res.status(200).send(`created`);
    } catch (e) {
      console.log(e);
      res.status(500).send(`Something went`);
    }
  } else {
    res.status(500).send(`Something went wrong`);
  }
};

const signin = async (req, res) => {
  var userData = req.body;
  console.log(userData)
  if (!userData.email || !userData.password) {
    // req.flash('message','Username and Password are mandatory')
    // return res.status(400).send("Username and Password are mandatory");
    return res.send("<script> alert('Username and Password are mandatory'); window.location =  '/users/login'; </script>")
  }
  let userNameResult = await userModel.find({
    email: userData.email,
    isVerified: true,
  });
  console.log(userNameResult)
  // console.log(userNameResult)
  if (userNameResult.length) {
    try {
      let passwordCompareresult = await passwordCompare(
        userData.password,
        userNameResult[0].password
      );
      if (passwordCompareresult) {
        var token = jwt.sign({ id: userNameResult[0].id }, key);
        return res.redirect("/users/dashboard")
      }
    } catch (e) {
      console.log(e);
      // res.status(400).send(`wrong password`);
      return res.send("<script> alert('wrong password'); window.location =  '/users/login'; </script>")
    }
  } else {
    // res.status(400).send(`Email is invalid`);
    return res.send("<script> alert('Email is invalid'); window.location =  '/users/login'; </script>")
  }
};
function generateRandomString(length) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset.charAt(randomIndex);
  }

  return randomString;
}

// Generate a random string of 5 characters



const forgotPassword = async (req, res) => {
  if (!req.body.email) {
    // return res.status(400).send("Please Enter Email");
    return res.send("<script> alert('Please Enter Email'); window.location =  '/users/changepassword'; </script>")
  }
  console.log(req.body.email)
  try {
    const data = await userModel.find({ email: req.body.email });
    if (data?.length < 1) {
        // return res.status(400).send("No Account Found please SignUp");
        return res.send("<script> alert('No Account Found please SignUp'); window.location =  '/users/changepassword'; </script>")
    }
    const randomString = generateRandomString(5);
    const dd = await userModel.findOneAndUpdate({email: req.body.email},{updatePasswordToken:randomString})
    console.log(dd);
    var token = jwt.sign({ id: data[0]._id }, key);
      let url = `http://localhost:8081/users/resetpassword?token=${randomString}`;
    // let html = `<a href=${url}>click here</a> to Reset Your password`
    let html = `
        
        <div style="font-family: Helvetica,Arial,sans-serif;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"><img src="https://png.pngtree.com/png-vector/20191125/ourmid/pngtree-beautiful-admin-roles-line-vector-icon-png-image_2035379.jpg" /></a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>You are receiving this because you (or someone else) have requested the reset of the password for your account. 
          Please click on the following link, or paste this into your browser to complete the process: 
          <a href=${url}>click here</a> to Reset Your password.
          'If you did not request this, please ignore this email and your password will remain unchanged.\n</p>
        </div>
      </div>
        
        `;

    // let res = await sendEmail(
    //   req.body.email,
    //   html,
    //   "Admin || Reset Password"
    // );
    // res.status(200).json({
    //   success: true,
    // });
    let r = await sendEmail(
      req.body.email,
      html,
      " Admin || Reset Password"
    );
    console.log(r)
    // res.status(200).json({
    //   sucess:true
    // });
   res.send("<script> alert('Success'); window.location =  '/users/resetpassword'; </script>")
  
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: e,
    });
  }
};

const verifyEmail = async (req, res) => {
  let { token } = req.body;
  console.log(req.body)
  if (!token) {
    return res.status(400).json("invalid");
  }
  console.log(token)
  try {
    var decode = jwt.verify(token, key);
    console.log(decode)
    if (!decode.id) {
      res.status(404).send("user Id not found");
      return;
    }
    var decode = jwt.verify(token, key);
    let resOfUser = await userModel.findByIdAndUpdate(decode.id, {
      isVerified: true,
    });
    // console.log(resOfUser)
    res.status(200).send("success");
  } catch (e) {
    console.log(e);
    res.status(500).send("Invalid Token");
  }
};
const validateUser = async (req, res) => {
  let { token } = req.body;
  console.log(req.body)
  try {
    var decode = jwt.verify(token, key);
    console.log(key)
    if (!decode.id) {
      res.status(404).send("user Id not found");
      return;
    }
    var decode = jwt.verify(token, key);
    let resOfUser = await userModel.findByIdAndUpdate(decode.id, {
      isVerified: true,
    });
    console.log(resOfUser);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(400).send("Invalid Token");
  }
};

const updatePassword = async (req, res) => {
  console.log(`sdds`,req.query.userId)
  try {
    console.log(req.body);
    let { newpwd } = req.body;
  
    let hashPassword = await passwordEncyption(newpwd);
    let data = await userModel.findByIdAndUpdate({_id:req.query.userId}, {
      password: hashPassword,
      updatePasswordToken:""
    });
    // res.status(200).json({ success: true });
    // return res.redirect("/users/dashboard")
    res.send("<script> alert('Success'); window.location =  '/users/login'; </script>")
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, message: e });
  }
};

const passwordEncyption = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

const passwordCompare = (password, hash) => {
  // console.log(`password and hash::`,password,hash)
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      if (result) {
        resolve(result);
      } else if (err) {
        reject(err);
      } else {
        reject("password not matched");
      }
    });
  });
};

module.exports = {
login,
register,
  signup,

  signin,
  passwordCompare,
  verifyEmail,
  passwordEncyption,
  forgotPassword,
  validateUser,
  updatePassword,
  changepassword,
resetpassword,
dashboard,
}