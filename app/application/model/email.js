

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const Email_ucSchema = new Schema({
  
     email: {
        type: String,
        unique: true,
        required: true,
      },
      otp: {
        type: String,
        required: true,
      },
    });
    
    Email_ucSchema.pre('save', function (next) {
        const user = this;
        if (!user.isModified(' otp')) return next();
      
        bcrypt.genSalt(10, (err, salt) => {
          if (err) return next(err);
      
          bcrypt.hash(user.otp, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            user.otp = hash;

            next();
          });
        });
      });

const Email_uc = mongoose.model('Email_uc', Email_ucSchema);
module.exports = Email_uc