

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const user_ucSchema = new Schema({
    fullname: {
        type: String,
        unique: true,
        required: true,
      },
     
      password: {
        type: String,
        required: true,
      },
     countryCode:{
        type: String,
        required: true,
     },
     phoneNumber:{
        type: String,
        required: true,
     },
   
    });
    
    user_ucSchema.pre('save', function (next) {
        const user = this;
        if (!user.isModified('password')) return next();
      
        bcrypt.genSalt(10, (err, salt) => {
          if (err) return next(err);
      
          bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            user.otp = hash;

            next();
          });
        });
      });

const User_uc = mongoose.model('User_uc', user_ucSchema);
module.exports = User_uc