

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const Phone_ucSchema = new Schema({
    countryCode:{
        type: String,
        required: true,
     },
     phoneNumber:{
        type: String,
        required: true,
     },
    
   
    });
    

const Phone_uc = mongoose.model('Phone_uc', Phone_ucSchema);
module.exports = Phone_uc