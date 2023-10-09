const { async, defer } = require("q");
const q = require("q"),
  passwordHash = require("password-hash"),
  { v4 } = require("uuid"),
  helper = require("../helper/index"),
  mongoHelper = require("../helper/mongo_helper");

const userModel = {};
/**
 * @param     :
 * @returns   :
 * @developer :
 */
userModel.insertUser = async function (body, userId) {
  let deferred = q.defer();

  if (body) {
    let date = await helper.getUtcTime();
    let hashedPassword = passwordHash.generate(body.userPassword);
    let insertObj = {
      uc_uuid: v4(Date.now()),
      uc_fk_au_uuid: userId,
      uc_name: body.userName,
      uc_email: body.userEmail,
      uc_dob: body.userNumber,
      uc_password: hashedPassword,
      uc_sex: body.userGender,
      uc_type: body.userType,
      uc_country: body.userCountry,
      uc_nickname: body.nickname,
      uc_age: body.age,
      uc_eu_privacy: body.eu_privacy,
      uc_nationality: body.nationality,
      uc_sexual_orientation: body.sexual_orientation,
      uc_activation_token: "",
      uc_type: body.type,
      uc_latitude: "",
      uc_longitude: "",
      uc_active: "1",
      uc_deleted: "0",
      uc_created: date,
      uc_updated: date,
    };

    let results = await mongoHelper.insert(insertObj, "users");

    if (results) {
      deferred.resolve(true);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

userModel.getuserlist = async function (body) {
  let deferred = q.defer();
  let UserObj = {
    uc_deleted: "0",
  };
  let userArray = await mongoHelper.getuserListData(
    UserObj,
    "users",
    body
  );
  if (userArray && userArray.data && userArray.data.length > 0) {
    for (const result of userArray.data) {
      result.uc_created = helper.dateFormat(result.uc_created, "date");
    }
    deferred.resolve(userArray);
  } else {
    deferred.resolve([]);
  }

  return deferred.promise;
};
/**
 * This function is using
 * @param     :
 * @returns   :
 * @developer :
 */
userModel.deleteuser = async function (body) {
  let deferred = q.defer();

  if (body.userId) {
    let selectObj = {
      uc_uuid: body.userId,
    };
    let updateObj = {
      uc_deleted: "1",
    },
      result = await mongoHelper.updateData(
        selectObj,
        "users_credential",
        updateObj
      );

    if (result) {
      deferred.resolve(true);
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
 * @param      :
 * @returns    :
 * @developer  :
 */
userModel.editUser = async function (body) {
  let deferred = q.defer();

  if (body.userId) {
    let selectObj = {
      uc_uuid: body.userId,
    };

    let res = await mongoHelper.getData(selectObj, "users_credential");

    if (res && res.length > 0) {
      let userData = res[0];
      let updateObj = {
        uc_active: userData.uc_active == "0" ? "1" : "0",
      };

      result = await mongoHelper.updateData(
        selectObj,
        "users_credential",
        updateObj
      );

      if (result) {
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

module.exports = userModel;
