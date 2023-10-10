

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt-nodejs');
// const Schema = mongoose.Schema;
// const { ObjectId } = Schema.Types;

// const user_ucSchema = new Schema({
//     fullname: {
//         type: String,
//         unique: true,
//         required: true,
//       },
     
//       password: {
//         type: String,
//         required: true,
//       },
    
   
//     });
    
//     user_ucSchema.pre('save', function (next) {
//         const user = this;
//         if (!user.isModified('password')) return next();
      
//         bcrypt.genSalt(10, (err, salt) => {
//           if (err) return next(err);
      
//           bcrypt.hash(user.password, salt, null, (err, hash) => {
//             if (err) return next(err);
//             user.password = hash;
//             user.otp = hash;

//             next();
//           });
//         });
//       });

// const User_uc = mongoose.model('User_uc', user_ucSchema);
// module.exports = User_uc
const q = require("q"),
    passwordHash = require("password-hash"),
    { v4 } = require("uuid"),
    helper = require("../helpers/index"),
    
    mongoHelper = require("../helpers/mongo_helpers");
nodeMailer = require('nodemailer');


const authModel = {};
/**
* This function is using to register in application
* @param     :
* @returns   :
* @developer :
* 
*/
authModel.register = async function (body) {
    let deferred = q.defer();

    if (body) {

        let uuid = v4(Date.now()),
            insertTable = "users_credential",
            date = await helper.getUtcTime();
        let referCode = await helper.createReferCode(10);

        let insertObj = {
            uc_uuid: uuid,
            uc_fullname:body.fullname,
            uc_password:body.password,
            uc_country: body.countryCode,
            uc_phone: body.phone,
            uc_email: body.email,
            uc_otp: body.otp
            
        };

        let results = await mongoHelper.insert(insertObj, insertTable);

        if (results) {

            let sendOtp = await authModel.sendActivationCodeOnPhone(body.countryCode + body.phone);

            if (sendOtp == true) {
                deferred.resolve(true);
            } else {
                deferred.resolve(false);
            }

        } else {
            deferred.resolve(false);
        }

    } else {
        deferred.resolve(false);
    }

    return deferred.promise;
};

/**
* This function is using 
* @param     : 
* @returns   : 
* @developer : 
*/
authModel.sendActivationCodeOnPhone = async function (phone) {
    let deferred = q.defer();

    if (phone) {

        const accountSid = 'ACeacd4fe35c88adeac450133d7b4c9f12';
        const authToken = '75e48c8556596f280283c0b300f23aa9';
        const client = require('twilio')(accountSid, authToken);

        client.verify.services('VAd320d8be479a20e2f96716dbd6f155e6').verifications.create(
            {
                to: phone,
                channel: 'sms'
            }
        ).then(verification => {

            deferred.resolve(true);

        }).catch(error => {

            if (error && error.code && error.code != '') {

                deferred.resolve(error.code);

            } else {

                deferred.resolve(false);

            }

        });

    } else {
        deferred.resolve(false);
    }

    return deferred.promise;

}
/**
 * This function is using to login
 * @param        :
 * @returns      :
 * @developer    :
 * @modification :
 */
authModel.loginWithPhoneEmail = async function (body, type) {

    let deferred = q.defer();

    if (body && body.phone && body.countryCode) {
        let phoneObj = {};
        if (type == 'PHONE') {
            phoneObj = {
                'uc_phone': body.phone,
                'uc_country_code': body.countryCode
            };
        } else {
            phoneObj = {
                'uc_email': body.phone,
            };
        }
        let userData = await mongoHelper.getData(phoneObj, 'users_credential');

        if (userData && userData.length > 0) {

            let loginUserData = userData[0];

            if (loginUserData.uc_password && passwordHash.verify(body.password, loginUserData.uc_password)) {


                let deviceObj = {
                    'ud_fk_uc_uuid': loginUserData.uc_uuid,
                    'ud_device_id': body.deviceId,
                    'ud_token': body.deviceToken,
                    'ud_type': 'M',
                    'ud_platform': body.devicePlatform,
                };
                let loginDevice = await authModel.addDeviceIfNotExists(deviceObj);

                if (loginDevice) {
                    deferred.resolve(loginUserData);
                } else {
                    deferred.resolve(false);
                }

            } else {
                deferred.resolve(false);
            }

        } else {
            deferred.resolve(false);
        }

    } else {
        deferred.resolve(false);
    }

    return deferred.promise;

}
/**
* This function is using to login
* @param        :
* @returns      :
* @developer    :
* @modification :  
*/
authModel.login = async function (body) {

    let deferred = q.defer();

    if (body && body.phone && body.countryCode) {

        let phoneObj = {
            'uc_phone': body.phone,
            'uc_country': body.countryCode
        };
        let userData = await mongoHelper.getData(phoneObj, 'users_credential');

        if (userData && userData.length > 0) {

            let loginUserData = userData[0];

            if (loginUserData.uc_password && passwordHash.verify(body.password, loginUserData.uc_password)) {


                let deviceObj = {
                    'ud_fk_uc_uuid': loginUserData.uc_uuid,
                    'ud_device_id': body.deviceId,
                    'ud_token': body.deviceToken,
                    'ud_type': 'M',
                    'ud_platform': body.devicePlatform,
                };
                let loginDevice = await authModel.addDeviceIfNotExists(deviceObj);

                if (loginDevice) {
                    deferred.resolve(loginUserData);
                } else {
                    deferred.resolve(false);
                }

            } else {
                deferred.resolve(false);
            }

        } else {
            deferred.resolve(false);
        }

    } else {
        deferred.resolve(false);
    }

    return deferred.promise;

}

module.exports = authModel;


      
