

let helper = {};
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
var emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
/**
 *
 * @param:
 * @returns:
 * @developer :
 */
helper.successHandler = function (res, options) {
  let status = "";
  if (options.status && options.status == false) {
    status = options.status;
  } else {
    status = true;
  }

  let obj = {
    status: status,
    code: (options && options.code) || "",
    message: (options && options.message) || "Operation performed successfully",
    payload: (options && options.payload) || {},
  };
  res.send(obj);
};

/**
 *
 * @param     :
 * @returns   :
 * @developer :
 */
helper.errorHandler = function (res, options, httpStatuCode = 501) {
  let status = "";

  if (options.status == "") {
    status = options.status;
  } else {
    status = true;
  }

  let obj = {
    status: status || false,
    code: (options && options.code) || "",
    message: (options && options.message) || "Something went wrong",
    payload: (options && options.payload) || [],
  };
  res.status(httpStatuCode).json(obj);
};

/**
 *
 * @param     :
 * @returns   :
 * @developer : 
 */
helper.getUidByToken = function (req) {
  let token = "",
    returnOb = {};
  if (req && req.cookies && req.cookies.token && req.cookies.token != "") {
    token = req.cookies.token;
  }

  if (token && token != "") {
    let decoded = jwt.verify(token, "@&*(29783-d4343daf4dd*&@&^#^&@#");

    if (decoded && decoded.userId) {
      returnOb.userId = decoded.userId;
      returnOb.email = decoded.email;
      returnOb.name = decoded.name;
      returnOb.image = decoded.image;
      returnOb.designation = decoded.designation;
    }
  }
  return returnOb;
};
/**
 * This helper is using to add mints in time
 * @developer   :
 * @modified    :
 */
helper.isEmailValid = async function (email) {
  if (!email) {
    return false;
  }

  if (email.length > 254) {
    return false;
  }

  var valid = emailRegex.test(email);

  if (!valid) {
    return false;
  }

  // Further checking of some things regex can't handle
  var parts = email.split("@");

  if (parts[0].length > 64) {
    return false;
  }

  var domainParts = parts[1].split(".");
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  ) {
    return false;
  }

  return true;
};

/**
 * This helper is using to get utc time
 * @param     :
 * @returns   :
 * @developer :
 */
helper.getUtcTime = async function (type) {
  let utcTime = new Date(new Date().toUTCString());
  (dt = utcTime.getDate()),
    (year = utcTime.getFullYear()),
    (month = utcTime.getMonth() + 1),
    (hours = utcTime.getHours()),
    (minutes = utcTime.getMinutes()),
    (second = utcTime.getSeconds());
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  second = second < 10 ? "0" + second : second;
  strTime = hours + ":" + minutes + ":" + second;

  if (dt < 10) {
    dt = "0" + dt;
  }
  month = month < 10 ? "0" + month : month;

  if (type && type != "" && type == "date") {
    returnVal = year + "-" + month + "-" + dt;
    return returnVal;
  } else if (type && type != "" && type == "time") {
    return strTime;
  } else {
    return utcTime;
  }
};
/**
 * This function is using to change string first letter in capital letter
 * @developer   :
 * @modified    :
 */
helper.capitalizeFirstLetter = function (text) {
  if (text) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  } else {
    return false;
  }
  return text;
};
/**
 * This helper is using to return date into a format
 * @param     : Date
 * @returns   : Date
 * @developer : Diksha
 */
/**
 * This helper is using to return date into a format
 * @param     : Date
 * @returns   : Date
 * @developer : Diksha
 */
helper.dateFormat = function (date, type = "") {
  if (date != "") {
    let newdate = new Date(date);
    let year = newdate.getFullYear(),
      month = newdate.getMonth() + 1,
      dt = newdate.getDate(),
      hours = newdate.getHours(),
      minutes = newdate.getMinutes(),
      ampm = hours >= 12 ? " PM" : " AM";

    if (dt < 10) {
      dt = "0" + dt;
    }
    month = [month];
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let strTime = hours + ":" + minutes + ampm;
    if (type != "") {
      returnDate = dt + "/" + month + "/" + year;
    } else {
      returnDate = month + "/" + dt + "/" + year + "/" + strTime;
    }
    return returnDate;
  }
};


module.exports = helper;
