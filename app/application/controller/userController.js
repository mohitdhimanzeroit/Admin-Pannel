const express = require('express');
const router = express.Router();
const Email_uc = require('../model/email');

const nodemailer = require('nodemailer');
const User_uc = require('../model/user')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');


const { Client } = require('twilio/lib/twiml/VoiceResponse');

const {TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true
})

const signup = async (req, res, next) => {
    
        try {
            
            const { fullname, password, countryCode, phoneNumber} = req.body;
            // Create a new user
            console.log(req.body)   
            const newInsert = new User_uc({
             fullname,
             password,
             countryCode,
             phoneNumber,
           });
           
           // Save the user to the database
           await newInsert.save();
           console.log(newInsert)

            const otpResponse = await client.verify.v2.services(TWILIO_SERVICE_SID)
            .verifications.create({
                to: `+${countryCode}${phoneNumber}`,
                channel: "sms",
                
            });
            res.status(200).send(`OTP send successfully!: ${JSON.stringify(otpResponse)}`);
            // res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(error?.status || 400).send(error?.message || `Something went wrong!`)
            // res.status(500).json({ error: "unauthorized" })
        }
        
    }
const verifyOTP = async (req, res, next) => {
    const { countryCode, phoneNumber,otp } =req.body;
    console.log(req.body)
    try {
        const verifiedResponse = await client.verify.v2.services(TWILIO_SERVICE_SID)
        .verificationChecks.create({
            to: `+${countryCode}${phoneNumber}`,
            code: otp,  
            
        })
        .then(verification_check => console.log(verification_check.status));
        res.status(200).send(`OTP verified successfuly!: ${JSON.stringify(verifiedResponse)}`);
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
}
const sendEmail = async(req, res) => {
    try {
        const { email } = req.body;
      console.log(req.body)
        // Generate a random OTP (for example, a 6-digit random number)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
        const newEmail = new Email_uc({
          email,
          otp,
        });
    
        // Save the user to the database
        await newEmail.save();
    console.log(newEmail)
        // Send OTP via email
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'mohitdhiman.zeroit@gmail.com',
            pass: 'ptqc vgnm lskb lgaq',
          },
        });
    
        const mailOptions = {
          from: 'mohitdhiman.zeroit@gmail.com',
          to: email,
          subject: 'OTP Verification',
          text: `Your OTP is: ${otp}`,
        };
    
        await transporter.sendMail(mailOptions);
    
        res.status(201).json({ message: 'User created successfully. Check your email for OTP.' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }

}

const verifyEmail = async (req, res) =>{
  try {
    const { email, otp } = req.body;
console.log(req.body)
    const user = await Email_uc.findOne({ email });
     console.log(user)
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      console.log(!user)
    } else {
      bcrypt.compare(otp, user.otp, (err, result) => {
        if (err || !result) {
          res.status(401).json({ error: 'OTP verification failed' });
        } else {
          res.status(200).json({ message: 'OTP verified successfully' });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = {
    signup,
    sendEmail,
    verifyOTP,
    verifyEmail,
};