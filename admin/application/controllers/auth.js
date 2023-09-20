
const passwordHash = require('password-hash'),
    helper = require('../helpers/index'),
    mongoHelper = require('../helpers/mongo_helper'),
    authModel = require('../model/auth_model');

    let authObj = {};
    authObj.login = async function (req, res) {
        let obj = {
            code: "",
            message: 'Something went wrong',
            status: false
        };
    
        if (req && req.body && req.body.email && req.body.password) {
    
            let checkEmailObj = {
                au_email: req.body.email
            },
                checkEmailDetail = await mongoHelper.getData(checkEmailObj, 'admin_users');
            if (checkEmailDetail && checkEmailDetail.length > 0) {
    
                let userData = checkEmailDetail[0];
    
                if (userData.au_password && passwordHash.verify(req.body.password, userData.au_password)) {
    
                    if (userData && userData.au_d == 1) {
    
                        obj.message = 'Your account has been blocked , Plese contact to Kwacha support';
                        helper.errorHandler(res, obj, 500);
    
                    } else if (userData && userData.au_active == 0) {
    
                        obj.message = 'Your account is not active';
                        helper.errorHandler(res, obj, 500);
    
                    } else if (userData && userData.au_deleted == 0 && userData.au_active == 1) {
    
                        let payload = {
                            iat: Date.now(),
                            "userId": userData.au_uuid,
                            "email": userData.au_email,
                            "name": userData.au_name,
                            "image": userData.au_image,
                        };
                        let token = jwt.sign(payload, "@&*(29783-d4343daf4dd*&@&^#^&@#");
                        res.cookie('token', token, { expire: 400000 + Date.now() });
                        res.cookie('subscriberEmail', userData.au_email, { expire: 400000 + Date.now() });
                        res.cookie('subscriberName', userData.au_name, { expire: 400000 + Date.now() });
    
                        let commonData = {
                            "au_name": userData.au_name,
                            "au_email": userData.au_email,
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
* Signup Controller
* @param         :
* @returns       :
* @developer     : 
* @modification  :
*/
authObj.register = async function (req, res) {

    if (req && req.body && req.body.email && req.body.password && req.body.name && req.body.lastName && req.body.name != '0') {

        let validEmail = await helper.isEmailValid(req.body.email);

        if (validEmail) {

            if (typeof req.body.email == 'string' && typeof req.body.password == 'string' && typeof req.body.name == 'string') {

                let obj = {
                    message: '',
                    status: false
                };

                if (req.body.email.length > 100) {
                    obj.message = 'Please enter the valid email max length of email is 100 characters';
                    helper.errorHandler(res, obj);
                }

                if (req.body.password.length > 200) {
                    obj.message = 'Please enter the valid password';
                    helper.errorHandler(res, obj);
                }

                if (req.body.name.length > 100) {
                    obj.message = 'Please enter the valid name max length of email is 100 characters';
                    helper.errorHandler(res, obj);
                }
            }
            let emailObj = { 'uc_email': req.body.email };
            let userDetailObj = await mongoHelper.getData(emailObj, 'users_credential');

            if (userDetailObj && userDetailObj.length > 0 && userDetailObj[0].uc_email) {

                let statusCode = '',
                    message = '';

                if (userDetailObj.uc_active == '0') {

                    statusCode = "ZT-E1002",
                        message = 'User already exists but not active.';

                } else if (userDetailObj.uc_d == '1') {

                    message = 'User prohibited, please contact knowex support team for help.';

                } else {

                    statusCode = "ZT-E1001",
                        message = 'User already exists. Please signup with other account.';

                }

                let obj = {
                    code: statusCode,
                    message: message,
                    status: false
                };

                helper.errorHandler(res, obj);

            } else {

                let result = await authModel.register(req.body);


                if (result) {

                    helper.successHandler(res, {
                        message: 'Account activation code sent to your email.'
                    });

                } else {

                    helper.errorHandler(res, {
                        status: false,
                        code: 'RE-10001'
                    }, 500);
                }
            }

        } else {

            let obj = {
                code: "ZT-E2001",
                message: 'Please enter valid email.',
                status: false
            };
            helper.errorHandler(res, obj);

        }

    } else {

        let obj = {
            code: "ZT-E2001",
            message: 'All fields are required',
            status: false
        };
        helper.errorHandler(res, obj);
    }
}

/**
* This function is using to 
* @param     : 
* @returns   : 
* @developer : 
*/
authObj.getUserData = async function (req, res) {

    let user = helper.getUidByToken(req);

    if (user && user.userId) {

        let result = await usersModel.getUserData(user.userId);

        helper.successHandler(res, {
            payload: result
        });

    } else {

        helper.errorHandler(res, {
            code: 'ASL-E1002',
            message: 'Unauthorized Error.',
            status: false
        });

    }

}

/**
* Fogot password controller
* @param     :
* @returns   :
* @developer :
*/
authObj.userForgotPassword = async function (req, res) {

    let obj = {};

    if (req.body && req.body.email) {

        let row = await authModel.forgotPassword(req.body.email);

        if (row && row.code) {

            obj.code = row.code;

            if (row.code == 'CCS-E1010') {

                obj.message = 'Wrong activation code';
                obj.status = false;

            } else if (row.code == 'CCS-E1013') {

                obj.message = 'Account does not exist';
                obj.status = false;

            } else if (row.code == 'CCS-E1002') {

                obj.message = 'Account exist but not verified';
                obj.status = false;

            }
            helper.errorHandler(res, obj, 500);

        } else {
            helper.successHandler(res, {});
        }
    } else {

        helper.errorHandler(res, {
            code: 'CCS-E2001',
            message: 'All fields are required.',
            status: false
        }, 500);

    }
}

/**
* Reset password controller
* @param     :
* @returns   :
* @developer : 
*/
authObj.userResetPassword = async function (req, res) {

    if (req.body.email && req.body.password && req.body.code) {

        let row = await authModel.resetPassword(req.body),
            obj = {};

        if (row && row.code) {

            if (row.code == 'CCS-E1010') {

                obj.message = 'You entered wrong token';
                obj.status = false;

            } else if (row.code == 'CCS-E1013') {

                obj.message = 'Account does not exist';
                obj.status = false;

            } else {

                obj.message = 'Something went wrong.';
                obj.status = false;
            }

            helper.errorHandler(res, obj, 500);

        } else {

            helper.successHandler(res, {
                message: 'Password reset successfully.'
            }, 200);
        }
    } else {

        helper.errorHandler(res, {
            code: 'CCS-E2001',
            message: 'All fields are required.',
            status: false
        }, 500);
    }
}

/**
* This function is using to 
* @param     : 
* @returns   : 
* @developer :
*/
authObj.userLogin = async function (req, res) {

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

                if (userData && userData.uc_d == 1) {

                    obj.message = 'Your account has been blocked , Plese contact to KnowEx support';
                    helper.errorHandler(res, obj, 500);

                } else if (userData && userData.uc_active == 0) {

                    obj.message = 'Your account is not active';
                    helper.errorHandler(res, obj, 500);

                } else if (userData && userData.uc_d == 0 && userData.uc_active == 1) {

                    let payload = {
                        iat: Date.now(),
                        "userId": userData.uc_uuid,
                        "email": userData.uc_email,
                        "name": userData.uc_name,
                        "image": userData.uc_image,
                    };
                    let token = jwt.sign(payload, "@&*(29783-d4343daf4dd*&@&^#^&@#");
                    res.cookie('token', token, { expire: 400000 + Date.now() });

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
        helper.errorHandler(res, obj, 500);
    }

}

/**
* Activate user account by entring activation code
* @param     :
* @returns   :
* @developer : 
*/
authObj.activateAccount = async function (req, res) {

    if (req.body.email && req.body.token) {

        let row = await authModel.activateAccount(req.body);

        if (row && row.code) {

            let obj = {};
            obj.code = row.code;

            if (row.code == 'ZT-E1011') {

                obj.message = 'Account already active. Please login with your credentials.';
                obj.status = false;

            } else {

                obj.message = 'Wrong activation code';
                obj.status = false;

            }

            helper.errorHandler(res, obj, 500);

        } else {
            helper.successHandler(res, {});
        }

    } else {

        helper.errorHandler(res, {
            code: 'CCS-E2001',
            message: 'All fields are required.',
            status: false
        }, 500);

    }

}

/**
* Reset password controller
* @param     :
* @returns   :
* @developer : 
*/
authObj.resendActivationCode = async function (req, res) {

    if (req.body.email) {

        let row = await authModel.resendActivationCode(req.body.email),
            obj = {};

        if (row && row.code) {

            obj.code = row.code;

            if (row.code == 'CCS-E1014') {

                obj.message = 'Account is already active';
                obj.status = false;
            }

            helper.errorHandler(res, obj);

        } else {
            helper.successHandler(res, {});
        }

    } else {

        helper.errorHandler(res, {
            code: 'CCS-E2001',
            message: 'All fields are required.',
            status: false
        }, 500);
    }

}

/**
* Activate user account by entring activation code
* @param     :
* @returns   :
*/

authObj.adminChangePassword = async function (req, res) {
    if (req.body && req.body.password && req.body.currentPassword && req.body.confirmPassword && (req.body.password === req.body.confirmPassword)) {
        let userId = helper.getUidByToken(req);
        let results = await authModel.adminChangePassword(req.body, userId);
        if (results) {
            helper.successHandler(res, {}, 200);
        } else {
            helper.errorHandler(res, {
                message: 'Failed, Please try again.'
            }, 500);
        }
    } else {
        helper.errorHandler(res, {}, 500);
    }
};

module.exports = authObj;