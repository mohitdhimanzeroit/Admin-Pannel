
const helper = require("../helpers/index");
const mongoHelper = require("../helpers/mongo_helper");

let homeObj = {};

/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
homeObj.index = async function (req, res) {
  let userObj = {
    uc_active: '1'

  },
    userData = await mongoHelper.getData(userObj, 'users_credential');




    let searchObj = {
      us_active: '0'
  
    },
    orderData = await mongoHelper.getData(searchObj, 'users_search')



  // let orderData = await mongoHelper.getData({}, 'users_orders');

  let selectObj = {
    uo_status: 'CANCELLED'

  },
    cancelData = await mongoHelper.getData(selectObj, "users_orders");
    

  let ordersObj = {
    uo_status: 'COMPLETED'
  },

    completeData = await mongoHelper.getData(ordersObj, 'users_orders');


  let Obj = {
    uo_status: 'PROCESSING'
  },

    inprogressData = await mongoHelper.getData(Obj, 'users_orders');
  res.render("dashboard", {
    data: {

      totalUsers: userData.length,
      totalOrder: orderData.length,
      cancelData: cancelData.length,
      completeData: completeData.length,
      inprogressData: inprogressData.length,
      totalNumber: 8436,
      totalClient: 4564347

    }
  });
};

/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
homeObj.searchListPage = async function (req, res) {
  res.render("searchList", {});
};



/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
homeObj.adminLogin = async function (req, res) {
  res.render("adminLogin", {

  });
};

homeObj.passwordForget = async function (req, res) {
  res.render("passwordForget", {

  });
};

homeObj.resetPassword = async function (req, res) {
  res.render("resetPassword", {

  });
};

/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
homeObj.insertUserPage = async function (req, res) {
  res.render("insertUser", {});
};

/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
homeObj.userListPage = async function (req, res) {
  res.render("userList", {});
};

/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
homeObj.changePasswordPage = async function (req, res) {
  res.render("changePassword", {});
};

homeObj.resetpwdScreen = async function (req, res) {
  res.render('resetpwdScreen', {});
}

homeObj.forgetpasswordScreen = async function (req, res) {
  res.render('forgetpasswordScreen', {});
}

/**
 * 
 * @param     :
 * @returns   :
 * @developer :
 */
homeObj.verificationScreen = async function (req, res) {
  res.render('verificationScreen', {});
}

module.exports = homeObj;
