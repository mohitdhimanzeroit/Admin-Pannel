
const q = require("q"),
  passwordHash = require("password-hash"),
  { v4 } = require("uuid"),
  helper = require("../helper/index"),

  randomstring = require("randomstring"),
  commonModel = require("./common_model");

let authModel = {};

/**
* This function is using
* @param     :
* @returns   :
* @developer :
*/
authModel.sendActivationEmail = async function (body, activationCode) {
  let to = body.email,
    from = "Kawacha-mania <mohitdhiman.zeroit@gmail.com>";

  if (body.name) {
    username = body.name;
  }

  let sub = "Activation Account";

  let emailArray = {
    to: to,
    from: from,
    subject: sub,
    body: "Your activation code is " + activationCode,
  };

  if (commonModel.generalMail(emailArray)) {
    return true;
  }
  return false;
};
/**
* Forgot password model
* @param     :
* @returns   :
* @developer :
*/
authModel.forgotPassword = async function (email) {
  let deferred = q.defer(),
    selectObj = {
      au_email: email,
    },
    results = await mongoHelper.getData(selectObj, "test");

  if (results && results.length > 0) {
    if (results[0].au_active == "1") {
      let randomNumber = Math.floor(Math.random() * (9999 - 1000) + 1000),
        updateObj = {
          au_activation_token: randomNumber,
        },
        result = await mongoHelper.updateData(
          selectObj,
          "test",
          updateObj
        );

      if (result) {
        let emailArray = {
          to: email,
          from: "Kawacha-mania <mohitdhiman.zeroit@gmail.com>",
          subject: "Forgot password ",
          body: "Your forgot password token is " + randomNumber + ".",
        };

        commonModel.generalMail(emailArray);

        deferred.resolve({
          message: "Forgot password token sent to your email",
        });
      } else {
        deferred.resolve(false);
      }
    } else {
      deferred.resolve({
        code: "CCS-E1002",
      });
    }
  } else {
    deferred.resolve({
      code: "CCS-E1013",
    });
  }

  return deferred.promise;
};


/**
* Reset password model
* @param     :
* @returns   :
* @developer :
*/
authModel.resetPassword = async function (body) {
  let deferred = q.defer(),
    selectObj = {
      au_email: body.email,
    },
    results = await mongoHelper.getData(selectObj, "test");

  if (results && results.length > 0) {
    if (results[0].au_activation_token == body.code) {
      let hashedPassword = passwordHash.generate(body.password);

      let updateObj = {
        au_activation_token: "",
        au_password: hashedPassword,
      },
        result = await mongoHelper.updateData(
          selectObj,
          "test",
          updateObj
        );

      if (result) {
        deferred.resolve(true);
      } else {
        deferred.resolve({
          code: "CCS-E1110",
        });
      }
    } else {
      deferred.resolve({
        code: "CCS-E1010",
      });
    }
  } else {
    deferred.resolve({
      code: "CCS-E1013",
    });
  }

  return deferred.promise;
};

/**
* Activate account model
* @param     :
* @returns   :
* @developer : Vipin, Ajay
*/
authModel.activateAccount = async function (body) {
  let deferred = q.defer();
  let selectObj = {
    au_email: body.email,
  };
  let sendCode = {
    code: "ZT-E1010",
  };
  let results = await mongoHelper.getData(selectObj, "test");

  if (results && results.length > 0) {
    if (results[0].uc_active == "1") {
      let obj = {
        code: "ZT-E1011",
      };

      deferred.resolve(obj);
      return deferred.promise;
    }

    if (results[0].uc_activation_token == body.token) {
      let updateObj = {
        au_active: "1",
      };

      let updateData = await mongoHelper.updateData(
        selectObj,
        "test",
        updateObj
      );

      if (updateData) {
        deferred.resolve(true);
      } else {
        deferred.resolve(sendCode);
      }
    } else {
      deferred.resolve(sendCode);
    }
  } else {
    deferred.resolve(sendCode);
  }

  return deferred.promise;
};

/**
* Resend Activation Code model
* @param     :
* @returns   :
* @developer :
*/
authModel.resendActivationCode = async function (email) {
  let deferred = q.defer();
  let selectObj = {
    au_email: email,
  };
  let results = await mongoHelper.getData(selectObj, "test");

  if (results && results.length > 0) {
    if (results[0].au_active == "0") {
      let randomNumber = Math.floor(Math.random() * (9999 - 1000) + 1000);
      let updateObj = {
        au_activation_token: randomNumber,
      },
        result = await mongoHelper.updateData(
          selectObj,
          "test",
          updateObj
        );

      if (result) {
        let emailArray = {
          to: email,
          from: "Kawacha-mania <mohitdhiman.zeroit@gmail.com>",
          subject: "Resending Account Activation ",
          body: " Your activation code is " + randomNumber + ".",
        };

        commonModel.generalMail(emailArray);

        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    } else {
      deferred.resolve({
        code: "CCS-E1014",
      });
    }
  } else {
    deferred.resolve({
      code: "CCS-E1013",
    });
  }

  return deferred.promise;
};

/**
* Activate user account when user click email link.
* @param     :
* @returns   :
* @developer :
*/
authModel.verifyUserAccount = async (userUUId = "") => {
  let deferred = q.defer();

  if (userUUId) {
    let selectQuery = `SELECT u_id, u_name, u_image, u_email, u_active_count, u_activation_token, u_active FROM user WHERE u_uuid = ?`,
      results = await commonModel.commonSqlQuery(selectQuery, [userUUId]);

    if (results && results.sqlMessage) {
      deferred.resolve({});
    } else {
      let updateQuery = `UPDATE user SET u_active = ?, u_active_count = ? WHERE u_uuid = ?`,
        dataArray = ["1", "0", userUUId];

      pool.query(updateQuery, dataArray, async (error, resultsOne) => {
        if (error) {
          deferred.resolve({});
        } else {
          commonModel.verifyPrimaryEmail(results[0].u_email, results[0].u_id);

          let date = await helper.getPstDateTime("timeDate"),
            joinDate = await helper.dateFormat(date, "n"),
            activityObj = {
              userId: results[0].u_id,
              actionUserId: results[0].u_id,
              description:
                results[0].u_name + " activated account on dated " + joinDate,
              activityType: "SIGNUP",
              date: date,
            },
            userData = {
              userId: results[0].u_id,
              userEmail: results[0].u_email,
              userName: results[0].u_name,
              userImage: results[0].u_image,
            };
          helper.insertUserActivityLogs(activityObj);

          authModel.sendWelcomeEmail(results[0].u_id);
          deferred.resolve(userData);
        }
      });
    }
  } else {
    deferred.resolve({});
  }

  return deferred.promise;
};

/**
 * This function is using for get keys list
 * @param     :
 * @returns   :
 * @developer :
 */

authModel.adminChangePassword = async function (body, userId) {
  let deferred = q.defer();
  let checkingUuid = {
    au_uuid: userId.userId
  };
  // return false;
  let result = await mongoHelper.getData(checkingUuid, 'test');

  let verifyPassword = passwordHash.verify(body.currentPassword, result[0].au_password);
  // return false;
  if (verifyPassword) {
    let hashedPassword = passwordHash.generate(body.password);
    let passwordObj = {
      au_password: hashedPassword
    };
    // return false;
    let resultOne = await mongoHelper.updateData(checkingUuid, "test", passwordObj);
    let resultO = await mongoHelper.getData(checkingUuid, 'test');
    // return false;
    if (resultOne) {
      deferred.resolve(resultOne);
    } else {
      deferred.resolve(false);
    }
    deferred.resolve(false);
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};


module.exports = authModel;
