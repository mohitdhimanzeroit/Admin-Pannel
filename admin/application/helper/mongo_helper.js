

const MongoClient = require("mongodb").MongoClient,
  mongoConfig = require("../../../common/config/mongo_config"),
  q = require("q");

let mongoObj = {},
  dbName = mongoConfig.dbName,
  url = mongoConfig.url;
const options = {
  keepAlive: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

// /**
//  * This function is using to
//  * @param     :
//  * @returns   :
//  * @developer :
//  */
// mongoObj.distance = async function (lat1, lat2, lon1, lon2) {
//   // The math module contains a function
//   // named toRadians which converts from
//   // degrees to radians.
//   lon1 = (lon1 * Math.PI) / 180;
//   lon2 = (lon2 * Math.PI) / 180;
//   lat1 = (lat1 * Math.PI) / 180;
//   lat2 = (lat2 * Math.PI) / 180;

//   // Haversine formula
//   let dlon = lon2 - lon1;
//   let dlat = lat2 - lat1;
//   let a =
//     Math.pow(Math.sin(dlat / 2), 2) +
//     Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

//   let c = 2 * Math.asin(Math.sqrt(a));

//   // Radius of earth in kilometers. Use 3956
//   // for miles
//   let r = 6371;

//   // calculate the result
//   return Math.round(c * r);
// }
// /**
//  * This func
//  * @param        :
//  * @returns      :
//  * @developer    :
//  * @modification :
//  */
// mongoObj.insert = async function (dataObj, tableName) {
//   let deferred = q.defer();

//   if (dataObj && tableName) {
//     MongoClient.connect(url, options, function (err, db) {
//       if (err) {
//         deferred.resolve(false);
//       } else {
//         let database = db.db(dbName);

//         database.collection(tableName).insertOne(dataObj, function (err, res) {
//           if (err) {
//             deferred.resolve(false);
//           }

//           if (res) {
//             db.close();
//             deferred.resolve(true);
//           }
//         });
//       }
//     });
//   }

//   return deferred.promise;
// };

// /**
//  * This function is used to get data from Mongo tables.
//  * @param       :
//  * @returns     :
//  * @developer   :
//  * @ModifiedBy  :
//  */
mongoObj.getData = async (dataObj, tableName) => {
  let deferred = q.defer();

  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve([]);
      } else {
        let database = db.db(dbName);

        database
          .collection(tableName)
          .find(dataObj)
          .toArray(function (err, res) {
            if (err) {
              deferred.resolve([]);
            }

            if (res) {
              db.close();
              deferred.resolve(res);
            } else {
              deferred.resolve([]);
            }
          });
      }
    });
  } else {
    deferred.resolve([]);
  }

  return deferred.promise;
};

// /**
//  * This function is using to
//  * @param       :
//  * @returns     :
//  * @developer   :
//  * @ModifiedBy  :
//  */
// mongoObj.deleteData = async function (dataObj, tableName) {
//   let deferred = q.defer();

//   if (dataObj && tableName) {
//     MongoClient.connect(url, options, function (err, db) {
//       if (err) {
//         deferred.resolve(false);
//       }

//       let database = db.db(dbName);

//       database.collection(tableName).deleteOne(dataObj, function (err, res) {
//         if (err) {
//           deferred.resolve(false);
//         }
//         if (res) {
//           db.close();
//           deferred.resolve(res);
//         }
//       });
//     });
//   }

//   return deferred.promise;
// };

// /**
//  * This function is using to
//  * @param       :
//  * @returns     :
//  * @developer   :
//  * @ModifiedBy  :
//  */
// mongoObj.updateData = async function (dataObj, tableName, updateObj) {
//   let deferred = q.defer();

//   if (dataObj && tableName && updateObj) {
//     let newvalues = { $set: updateObj };

//     MongoClient.connect(url, options, function (err, db) {
//       if (err) {
//         deferred.resolve(false);
//       }

//       let database = db.db(dbName);

//       database
//         .collection(tableName)
//         .updateOne(dataObj, newvalues, function (err, res) {
//           if (err) {
//             deferred.resolve(false);
//           }

//           if (res) {
//             db.close();
//             deferred.resolve(true);
//           }
//         });
//     });
//   }
//   return deferred.promise;
// };

// /**
//  * This function is using to
//  * @param       :
//  * @returns     :
//  * @developer   :
//  * @ModifiedBy  :
//  */
// mongoObj.getuserListData = async function (dataObj, tableName, body) {
//   let deferred = q.defer();
//   if (dataObj && tableName) {
//     MongoClient.connect(url, options, function (err, db) {
//       if (err) {
//         deferred.resolve(false);
//       } else {
//         let database = db.db(dbName),
//           mysort = { '_id': 1 },
//           sortBy = "",
//           sortOrder = "",
//           lastId = "",
//           queryObj = "",
//           recordsPerPage = 10,


//           page = 0,
//           query = {};
//         if (body.perPage) {
//           recordsPerPage = body.perPage;
//         }

//         if (body.page) {
//           page = body.page;
//         }

//         if (body.sortBy) {
//           sortBy = body.sortBy;
//         }

//         if (body.sortOrder) {
//           sortOrder = body.sortOrder;
//         }

//         if (body.last) {
//           lastId = body.last;
//         }

//         if (lastId) {
//           query._id = { $lte: lastId };
//         }

//         if (sortBy == "uc_name") {
//           if (sortOrder == "ASC") {
//             mysort = { uc_name: 1 };
//           } else {
//             mysort = { uc_name: -1 };
//           }
//         }
//         if (sortBy == "uc_created") {
//           if (sortOrder == "ASC") {
//             mysort = { uc_created: 1 };
//           } else {
//             mysort = { uc_created: -1 };
//           }
//         }

//         if (sortBy == "uc_balance") {
//           if (sortOrder == "ASC") {
//             mysort = { uc_balance: 1 };
//           } else {
//             mysort = { uc_balance: -1 };
//           }
//         }

//         if (body.perPage) {
//           dataObj = {
//             uc_name: {
//               $regex: new RegExp('.*' + body.keywords + '.*', 'i')
//             },
//             uc_deleted: '0'
//           }

//         }
//         let offset = page * recordsPerPage;
//         database
//           .collection(tableName)
//           .find(dataObj)
//           .sort(mysort)
//           .toArray(function (err, result) {
//             database
//               .collection(tableName)
//               .find(dataObj)
//               .sort(mysort)
//               .skip(offset)
//               .limit(Number(recordsPerPage))
//               .toArray(function (err, res) {
//                 if (err) {
//                   deferred.resolve([]);
//                 }
//                 if (res) {
//                   if (body.last && body.last != "") {
//                     database
//                       .collection(tableName)
//                       .find(dataObj)
//                       .sort(mysort)
//                       .toArray(function (err, result1) {
//                         let obj = {
//                           data: res,
//                           more_records: result1.length,
//                           total_records: result.length,
//                           offset: offset,
//                           per_page: recordsPerPage,
//                           sortOrder: body.sortOrder,
//                           page: page,
//                           last: result[0]["uc_uuid"],
//                         };
//                         deferred.resolve(obj);
//                       });
//                   } else {
//                     let id = "";

//                     if (res != "") {
//                       id = res[0]["uc_uuid"];
//                     }

//                     let obj = {
//                       data: res,
//                       more_records: 0,
//                       per_page: recordsPerPage,
//                       offset: offset,
//                       total_records: result.length,
//                       page: page,
//                       sortOrder: body.sortOrder,
//                       last: id,
//                     };
//                     deferred.resolve(obj, "last");
//                   }

//                   db.close();
//                 }
//               });
//           });
//       }
//     });
//   }
//   return deferred.promise;
// };

// /**
// * This function is used to get data from Mongo tables.
// * @param       :
// * @returns     :
// * @developer   :
// * @ModifiedBy  :
// */
// mongoObj.getData = async (dataObj, tableName) => {
//   let deferred = q.defer();

//   if (dataObj && tableName) {
//     MongoClient.connect(url, options, function (err, db) {
//       if (err) {
//         deferred.resolve([]);
//       } else {
//         let database = db.db(dbName);

//         database
//           .collection(tableName)
//           .find(dataObj)
//           .toArray(function (err, res) {
//             if (err) {
//               deferred.resolve([]);
//             }

//             if (res) {
//               db.close();
//               deferred.resolve(res);
//             } else {
//               deferred.resolve([]);
//             }
//           });
//       }
//     });
//   } else {
//     deferred.resolve([]);
//   }

//   return deferred.promise;
// };

// /**
// * This function is used to get data from Mongo tables.
// * @param       :
// * @returns     :
// * @developer   :
// * @ModifiedBy  :
// */
// mongoObj.getListData = async function (dataObj, tableName, body) {

//   let deferred = q.defer();

//   if (dataObj && tableName) {
//     MongoClient.connect(url, options, function (err, db) {

//       if (err) {

//         deferred.resolve(false);

//       } else {

//         let database = db.db(dbName);
//         let mysort = body.sortByObj,
//           recordsPerPage = 10,
//           page = 0;

//         if (body.perPage) {
//           recordsPerPage = body.perPage;
//         }

//         if (body.page) {
//           page = body.page;
//         }
//         let offset = page * recordsPerPage;

//         database.collection(tableName).find(dataObj).sort(mysort).toArray(function (err, result) {

//           database.collection(tableName).find(dataObj).sort(mysort).skip(offset).limit(Number(recordsPerPage)).toArray(function (err, res) {

//             if (err) {
//               deferred.resolve([]);
//             }

//             if (res) {

//               let obj = {
//                 data: res,
//                 total_records: result.length,
//               };
//               deferred.resolve(obj);

//               db.close();
//             }
//           });
//         });
//       }
//     });
//   } else {
//     deferred.resolve(false);
//   }
//   return deferred.promise;
// }

// /**
//   * This function is used to get data from Mongo tables.
//   * @param       :
//   * @returns     :
//   * @developer   :
//   * @ModifiedBy  :
//   */
// mongoObj.getDataDetail = async function (dataObj, tableName) {

//   let deferred = q.defer();

//   if (dataObj && tableName) {

//     MongoClient.connect(url, options, function (err, db) {

//       if (err) {

//         deferred.resolve(false);

//       } else {

//         let database = db.db(dbName),
//           mysort = { '_id': -1 },
//           sortBy = '',
//           sortOrder = '',
//           lastId = '',
//           queryObj = '',
//           recordsPerPage = 120,
//           page = 2,
//           query = {};

//         if (dataObj.per_page) {
//           recordsPerPage = dataObj.per_page;
//         }

//         if (dataObj.page) {
//           page = dataObj.page;
//         }

//         if (dataObj.sortBy) {
//           sortBy = dataObj.sortBy;
//         }

//         if (dataObj.sortOrder) {
//           sortOrder = dataObj.sortOrder;
//         }


//         if (dataObj.last) {
//           lastId = dataObj.last;
//         }

//         if (lastId) {
//           query._id = { "$lte": lastId };
//         }

//         let offset = page * recordsPerPage;

//         database.collection(tableName).find(dataObj).sort(mysort).toArray(function (err, result) {

//           database.collection(tableName).find(dataObj).sort(mysort).skip(offset).limit(Number(recordsPerPage)).toArray(function (err, res) {

//             if (err) {
//               deferred.resolve([]);
//             }

//             if (res) {

//               if ((dataObj.last) && dataObj.last != '') {

//                 database.collection(tableName).find(dataObj).sort(mysort).toArray(function (err, result1) {

//                   let obj = {
//                     data: res,
//                     more_records: result1.length,
//                     total_records: result.length,
//                     last: result[0]['uo_uuid'],

//                   };
//                   deferred.resolve(obj);
//                 })
//               } else {

//                 let id = '';

//                 if (res != '') {
//                   id = res[0]['uo_uuid'];
//                 }

//                 let obj = {
//                   data: res,
//                   more_records: 0,
//                   total_records: result.length,
//                   last: id,
//                 };
//                 deferred.resolve(obj);
//               }

//               db.close();
//             }
//           });
//         });
//       }
//     });
//   }
//   return deferred.promise;
// }


// mongoObj.getSearchListData = async function (dataObj, tableName, body) {
//   let deferred = q.defer();

//   if (dataObj && tableName) {
//     MongoClient.connect(url, options, function (err, db) {
//       if (err) {
//         deferred.resolve(false);
//       } else {
//         let database = db.db(dbName),
//           mysort = { '_id': 1 },
//           sortBy = "",
//           sortOrder = "",
//           lastId = "",
//           queryObj = "",
//           recordsPerPage = 10,
//           page = 0,
//           query = {};
//         if (body.perPage) {
//           recordsPerPage = body.perPage;
//         }

//         if (body.page) {
//           page = body.page;
//         }

//         if (body.sortBy) {
//           sortBy = body.sortBy;
//         }

//         if (body.sortOrder) {
//           sortOrder = body.sortOrder;
//         }

//         if (body.last) {
//           lastId = body.last;
//         }

//         if (lastId) {
//           query._id = { $lte: lastId };
//         }


//         if (sortBy == "ut_created") {
//           if (sortOrder == "ASC") {
//             mysort = { ut_created: 1 };
//           } else {
//             mysort = { ut_created: -1 };
//           }
//         }

//         if (sortBy == "ut_balance") {
//           if (sortOrder == "ASC") {
//             mysort = { ut_balance: 1 };
//           } else {
//             mysort = { ut_balance: -1 };
//           }
//         }
//         if (body.keywords) {
//           dataObj = {
//             ut_type: {
//               $regex: new RegExp(".*" + body.keywords + ".*", 'i')
//             }, ut_type_status: 'COMPLETED',
//           }

//         }


//         let offset = page * recordsPerPage;
//         database
//           .collection(tableName)
//           .find(dataObj)
//           .sort(mysort)
//           .toArray(function (err, result) {
//             database
//               .collection(tableName)
//               .find(dataObj)
//               .sort(mysort)
//               .skip(offset)
//               .limit(Number(recordsPerPage))
//               .toArray(function (err, res) {
//                 if (err) {
//                   deferred.resolve([]);
//                 }
//                 if (res) {
//                   if (body.last && body.last != "") {
//                     database
//                       .collection(tableName)
//                       .find(dataObj)
//                       .sort(mysort)
//                       .toArray(function (err, result1) {
//                         let obj = {
//                           data: res,
//                           more_records: result1.length,
//                           total_records: result.length,
//                           offset: offset,
//                           per_page: recordsPerPage,
//                           sortOrder: body.sortOrder,
//                           page: page,
//                           last: result[0]["ut_uuid"],
//                         };

//                         deferred.resolve(obj);
//                       });
//                   } else {
//                     let id = "";

//                     if (res != "") {
//                       id = res[0]["ut_uuid"];
//                     }

//                     let obj = {
//                       data: res,
//                       more_records: 0,
//                       per_page: recordsPerPage,
//                       offset: offset,
//                       total_records: result.length,
//                       page: page,
//                       sortOrder: body.sortOrder,
//                       last: id,
//                     };
//                     deferred.resolve(obj);
//                   }

//                   db.close();
//                 }
//               });
//           });
//       }
//     });
//   }
//   return deferred.promise;
// };
module.exports = mongoObj;
