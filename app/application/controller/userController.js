/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : Anoop kumar <anoop.zeroit@gmail.com>, aug 2023
 * Description :
 * Modified By :
 */
const { async } = require("q");
const helper = require("../helpers/index"),
    mongoHelper = require('../helpers/mongo_helpers'),
    passwordHash = require("password-hash"),
    authModel = require("../model/user");


fs = require('fs'),
    path = require('path'),
    Busboy = require('busboy');

let authObj = {}


/**
 * 
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 * 
 */
authObj.register = async function (req, res) {

    if (req && req.body && req.body.fullname && req.body.password) {

        let obj = {
            message: '',
            status: false
        };

        if (req.body.fullname) {
            obj.message = 'Please enter the fullname';
            helper.successHandler(res, obj);
            return;
        }

        if (req.body.password) {
            obj.message = 'Please enter the password';
            helper.successHandler(res, obj);
            return;
        }

        let phoneObj = {
            'uc_phone': req.body.phone,
            'uc_country': req.body.countryCode
        };
        let userDetailObj = await mongoHelper.getData(phoneObj, 'users_credential');

        if (userDetailObj && userDetailObj.length > 0
            && userDetailObj[0].uc_phone && userDetailObj[0].uc_permanent_deleted != "1") {

            let statusCode = '',
                message = '';

            if (userDetailObj[0].uc_active == '0') {

                let sendOtp = await authModel.sendActivationCodeOnPhone(req.body.countryCode + req.body.phone);

                if (sendOtp == true) {

                    helper.successHandler(res, {});
                    return;

                } else {

                    helper.successHandler(res, {
                        status: false,
                        message: 'Failed, Please try again.',
                        code: 'RE-100011'
                    });
                    return;
                }

            } else if (userDetailObj[0].uc_deleted == '1') {

                message = 'User prohibited, please contact UberMaa support team for help.';

            } else if (userDetailObj[0].uc_active == '1') {

                statusCode = "ZT-E1001",
                    message = 'User already exists. Please signup with other account.';

            }

            let obj = {
                code: statusCode,
                message: message,
                status: false
            };

            helper.successHandler(res, obj);

        } else {

            let result = await authModel.register(req.body);

            if (result) {

                helper.successHandler(res, {});

            } else {

                helper.successHandler(res, {
                    status: false,
                    message: 'Failed, Please try again.',
                    code: 'RE-10001'
                });
            }
        }

    } else {

        let obj = {
            code: "ZT-E20011111111111",
            message: 'Please Fill required  fields.',
            status: false
        };
        helper.successHandler(res, obj);
    }

}
/**
 * 
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 * 
 */
authObj.registerWithEmail = async function (req, res) {


    let userId = helper.getUUIDByToken(req);
    let email = req.body.email;
    let hashedPassword = passwordHash.generate(req.body.password);
    if (req && req.body.name && req.body.email && hashedPassword &&
        req.body.nickname && req.body.dob && req.body.sex && req.body.country
        && req.body.eu_privacy && req.body.nationality && req.body.sexual_orientation
        && req.body.type && req.body.countryCode
    ) {

        let validEmail = await helper.isEmailValid(req.body.email);

        let userEmailData = '';
        userEmailData = await authModel.checkEmailExist(req.body.email);
        if (userEmailData && userEmailData.length > 0) {
            let updateObj = {
                uc_email: email,
            };

            let selectObj = {
                uc_uuid: userId,
            };

            let results = await mongoHelper.updateData(selectObj, "users_credential", updateObj);
            let resultArray = await mongoHelper.getData(updateObj, "users_credential");
            let payload = {
                iat: Date.now(),
                "userId": resultArray[0].uc_uuid,
            },
                token = jwt.sign(payload, '@&*(29783-d4343daf4dd*&@&^#^&@#');
            let commonData = {
                "uc_token": token,
                "uc_name": resultArray[0].uc_name,
                "uc_email": resultArray[0].uc_email,

            };
            let obj = {
                payload: commonData
            };
            helper.successHandler(res, obj);


        } else {

            let results = await authModel.insertUserGoogleData(req.body);

            if (results) {

                let emailObj = {
                    'uc_email': email,
                };
                let resultArray = await mongoHelper.getData(emailObj, "users_credential");
                let payload = {
                    iat: Date.now(),
                    "userId": resultArray[0].uc_uuid,
                },
                    token = jwt.sign(payload, '@&*(29783-d4343daf4dd*&@&^#^&@#');
                let commonData = {
                    "uc_token": token,
                    "uc_name": resultArray[0].uc_name,
                    "uc_email": resultArray[0].uc_email,
                    "uc_type": resultArray[0].uc_type,

                };
                let obj = {
                    payload: commonData
                };
                helper.successHandler(res, obj);


            } else {

                helper.errorHandler(res, {
                    status: false,
                    code: 'RE-10002'
                }, 200);

            }

        }

    }
    else {
        helper.errorHandler(res, {
            code: "ASL-E1002",
            message: "Please fill manadatory fields.",
            status: false,
        });
    }

}

/**
 * Login Controller
 * @param        :
 * @returns      :
 * @developer    : 
 * @modification : 
 */
authObj.loginWithPhone = async function (req, res) {

    if (req && req.body && req.body.phone && req.body.countryCode && req.body.password && req.body.deviceToken && req.body.deviceId && req.body.devicePlatform) {

        let phoneObj = {
            'uc_phone': req.body.phone,
            'uc_country': req.body.countryCode
        };
        let userData = await mongoHelper.getData(phoneObj, 'users_credential');

        if (userData && userData.length > 0 && userData[0].uc_permanent_deleted != "1") {

            let verifyPassword = passwordHash.verify(req.body.password, userData[0].uc_password);

            if (userData[0].uc_active && userData[0].uc_active == '0') {

                let obj = {
                    code: "CCS-E1000",
                    message: 'User doesn`t exist.',
                    status: false
                };
                helper.errorHandler(res, obj, 200);

            } else if (userData[0].uc_deleted && userData[0].uc_deleted == '1') {

                let obj = {
                    code: "CCS-E1001",
                    message: 'User prohibited, please contact UberMaa support team for help.',
                    status: false
                };
                helper.errorHandler(res, obj, 200);

            } else if (!verifyPassword) {

                let obj = {
                    code: "CCS-E1002",
                    message: 'Incorrect username or password.',
                    status: false
                };

                helper.errorHandler(res, obj, 200);

            } else {

                if (userData[0].uc_active == '1') {

                    let result = await authModel.login(req.body);

                    if (result) {

                        let payload = {
                            iat: Date.now(),
                            "userId": result.uc_uuid,
                        },

                            token = jwt.sign(payload, '@&*(29783-d4343daf4dd*&@&^#^&@#');
                        result.token = token;
                        let commonData = {
                            "token": result.token,
                            "userType": result.uc_user_type,
                            "onlineStatus": result.uc_online_status
                        };

                        let obj = {
                            message: 'Login successfully.',
                            payload: commonData
                        };

                        helper.successHandler(res, obj);

                    } else {

                        let obj = {
                            code: "CCS-E10003",
                            status: false
                        };
                        helper.errorHandler(res, obj, 200);

                    }

                } else {

                    let obj = {
                        code: "CCS-E1004",
                        message: 'Login credentials are incorrect.',
                        status: false
                    };
                    helper.errorHandler(res, obj, 200);

                }
            }

        } else {

            let obj = {
                code: "CCS-E1005",
                message: 'Account does not exist.',
                status: false
            };
            helper.errorHandler(res, obj, 200);

        }

    } else {

        let obj = {
            code: "CCS-E1006",
            message: 'All fields are required',
            status: false
        };
        helper.errorHandler(res, obj, 200);

    }

}


/**
 * resend activation code  via phone no. 
 * @param     : phone 
 * @returns   :
 * @developer : 
 */
authObj.resendActivationPhoneCode = async function (req, res) {

    if (req && req.body && req.body.phone && req.body.countryCode) {


        let response = await authModel.sendActivationCodeOnPhone(req.body.countryCode + req.body.phone);

        if (response) {

            helper.successHandler(res, {
                message: 'Account activation code sent to your phone.'
            });

        } else {

            helper.errorHandler(res, {
                code: 'CCS-E2001',
                message: 'Somthing went wrong. ',
                status: false
            }, 200);

        }

    } else {

        helper.errorHandler(res, {
            code: 'CCS-E2001',
            message: 'All fields are required.',
            status: false
        }, 200);

    }

}








/**
 * Used to 
 * Created By 	: 
 * Modified By 	: 
 */
authObj.loginWithEmail = async function (req, res) {
    let obj = {
        code: "",
        message: 'Something went wrong',
        status: false
    };

    if (req && req.body && req.body.email && req.body.password) {

        let checkEmailObj = {
            uc_email: req.body.email
        },
            checkEmailDetail = await mongoHelper.getData(checkEmailObj, 'users_credential');

        if (checkEmailDetail && checkEmailDetail.length > 0) {

            let userData = checkEmailDetail[0];

            if (userData.uc_password && passwordHash.verify(req.body.password, userData.uc_password)) {

                if (userData && userData.uc_deleted == 1) {

                    obj.message = 'Your account has been blocked , Plese contact to Kwacha support';
                    helper.errorHandler(res, obj, 500);

                } else if (userData && userData.uc_active == 0) {

                    obj.message = 'Your account is not active';
                    helper.errorHandler(res, obj, 500);

                } else if (userData && userData.uc_deleted == 0 && userData.uc_active == 1) {

                    let payload = {
                        iat: Date.now(),
                        "userId": userData.uc_uuid,
                        "email": userData.uc_email,
                        "name": userData.uc_name,

                    };
                    let token = jwt.sign(payload, "@&*(29783-d4343daf4dd*&@&^#^&@#");


                    let commonData = {
                        "uc_name": userData.uc_name_,
                        "uc_email": userData.uc_email,
                        "token": token
                    };

                    obj.payload = commonData;
                    obj.message = 'Login successfully';
                    helper.successHandler(res, obj);

                } else {
                    helper.errorHandler(res, obj, 500);
                }

            } else {
                obj.message = 'Email and password do not match. Please try again.';
                helper.errorHandler(res, obj, 500);
            }

        } else {
            obj.message = 'Your account does not exist.';
            helper.errorHandler(res, obj, 500);
        }

    } else {

        helper.errorHandler(res, {
            code: "ZT-E1000",
            message: "Please fill manadatory fields."
        }, 500);

    }

}

/**
 * Login Controller
 * @param        :
 * @returns      :
 * @developer    :
 * @modification :
 */
authObj.loginWithPhoneEmail = async function (req, res) {

    if (req && req.body && req.body.phone && req.body.countryCode && req.body.password && req.body.deviceToken && req.body.deviceId && req.body.devicePlatform) {
        let type = 'PHONE';
        let phoneObj = {
            'uc_phone': req.body.phone,
        };
        let userData = await mongoHelper.getData(phoneObj, 'users_credential');

        if (userData.length == 0) {
            type = 'EMAIL';
            let phoneObj = {
                'uc_email': req.body.phone,
            };

            userData = await mongoHelper.getData(phoneObj, 'users_credential');
        }

        if (userData && userData.length > 0) {

            let verifyPassword = passwordHash.verify(req.body.password, userData[0].uc_password);

            if (userData[0].uc_active && userData[0].uc_active == '0') {
                let obj = {
                    code: "CCS-E1000",
                    message: 'User doesn`t exist.',
                    status: false
                };
                helper.errorHandler(res, obj, 200);

            } else if (userData[0].uc_deleted && userData[0].uc_deleted == '1') {

                let obj = {
                    code: "CCS-E1001",
                    message: 'User prohibited, please contact UrTap support team for help.',
                    status: false
                };
                helper.errorHandler(res, obj, 200);

            } else if (!verifyPassword) {

                let obj = {
                    code: "CCS-E1002",
                    message: 'Incorrect username or password.',
                    status: false
                };

                helper.errorHandler(res, obj, 200);

            } else {

                if (userData[0].uc_active == '1') {

                    let result = await authModel.loginWithPhoneEmail(req.body, type);

                    if (result) {

                        let payload = {
                            iat: Date.now(),
                            "userId": result.uc_uuid,
                        },

                            token = jwt.sign(payload, '@&*(29783-d4343daf4dd*&@&^#^&@#');
                        console.log(token);
                        result.token = token;
                        let commonData = {
                            "token": result.token,
                            "userType": result.uc_user_type,
                            "onlineStatus": result.uc_online_status
                        };

                        let obj = {
                            message: 'Login successfully.',
                            payload: commonData
                        };

                        helper.successHandler(res, obj);

                    } else {

                        let obj = {
                            code: "CCS-E10003",
                            status: false
                        };
                        helper.errorHandler(res, obj, 200);

                    }

                } else {

                    let obj = {
                        code: "CCS-E1004",
                        message: 'Login credentials are incorrect.',
                        status: false
                    };
                    helper.errorHandler(res, obj, 200);

                }
            }

        } else {

            let obj = {
                code: "CCS-E1005",
                message: 'Account does not exist.',
                status: false
            };
            helper.errorHandler(res, obj, 200);

        }

    } else {

        let obj = {
            code: "CCS-E1006",
            message: 'All fields are required',
            status: false
        };
        helper.errorHandler(res, obj, 200);

    }
}




module.exports = authObj;