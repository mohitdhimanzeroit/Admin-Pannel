

const MongoClient = require("mongodb").MongoClient,
mongoConfig   = require("../../../common/config/mongo_config"),
    q             = require("q");

let mongoObj = {},
  dbName     = mongoConfig.dbName,
  url        = mongoConfig.url;

let options = {
  keepAlive: true,
};



/**
 * This function
 * @param        :
 * @returns      :
 * @developer    :
 * @modification :
 */

 mongoObj.insert = async function (dataObj, tableName) {
  let deferred = q.defer();
  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      } else {
        let database = db.db(dbName);

        database.collection(tableName).insertOne(dataObj, function (err, res) {

          if (err) {
            deferred.resolve(false);
          }

          if (res) {
            db.close();
            deferred.resolve(true);
          }
        });
      }
    });
  }

  return deferred.promise;
};

/**
 * This function is using to
 * @param       :
 * @returns     :
 * @developer   :
 * @ModifiedBy  :
 */
mongoObj.updateData = async function (dataObj, tableName, updateObj) {
  let deferred = q.defer();

  if (dataObj && tableName && updateObj) {
    let newvalues = { $set: updateObj };

    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      }

      let database = db.db(dbName);

      database
        .collection(tableName)
        .updateOne(dataObj, newvalues, function (err, res) {
          if (err) {
            deferred.resolve(false);
          }

          if (res) {
            db.close();
            deferred.resolve(true);
          }
        });
    });
  }
  return deferred.promise;
};

/**
* This function is used to get data from Mongo tables.
* @param       :
* @returns     :
* @developer   :
* @ModifiedBy  :
*/
mongoObj.getuserListData = async function (dataObj, tableName, body) {
  let deferred = q.defer();
  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      } else {
        let database = db.db(dbName),
          mysort = { '_id': 1 },
          sortBy = "",
          sortOrder = "",
          lastId = "",
          queryObj = "",
          recordsPerPage = 10,
          page = 0,
          query = {};
        if (body.perPage) {
          recordsPerPage = body.perPage;
        }

        if (body.page) {
          page = body.page;
        }

        if (body.sortBy) {
          sortBy = body.sortBy;
        }

        if (body.sortOrder) {
          sortOrder = body.sortOrder;
        }

        if (body.last) {
          lastId = body.last;
        }

        if (lastId) {
          query._id = { $lte: lastId };
        }

        if (sortBy == "uc_name") {
          if (sortOrder == "ASC") {
            mysort = { uc_name: 1 };
          } else {
            mysort = { uc_name: -1 };
          }
        }
        if (sortBy == "uc_created") {
          if (sortOrder == "ASC") {
            mysort = { uc_created: 1 };
          } else {
            mysort = { uc_created: -1 };
          }
        }
      
        if (body.perPage) {
          console.log(body.byName);
          dataObj = {
            uc_name: {
              $regex: new RegExp('.*' + body.byName + '.*', 'i')
            },
            uc_deleted: '0'
          }

        }
        let offset = page * recordsPerPage;
        database
          .collection(tableName)
          .find(dataObj)
          .sort(mysort)
          .toArray(function (err, result) {
            database
              .collection(tableName)
              .find(dataObj)
              .sort(mysort)
              .skip(offset)
              .toArray(function (err, res) {
                if (err) {
                  deferred.resolve([]);
                }
                if (res) {
                  if (body.last && body.last != "") {
                    database
                      .collection(tableName)
                      .find(dataObj)
                      .sort(mysort)
                      .toArray(function (err, result1) {
                        let obj = {
                          data: res,
                          more_records: result1.length,
                          total_records: result.length,
                          offset: offset,
                          per_page: recordsPerPage,
                          sortOrder: body.sortOrder,
                          page: page,
                          last: result[0]["uc_uuid"],
                        };
                        deferred.resolve(obj);
                      });
                  } else {
                    let id = "";

                    if (res != "") {
                      id = res[0]["uc_uuid"];
                    }

                    let obj = {
                      data: res,
                      more_records: 0,
                      per_page: recordsPerPage,
                      offset: offset,
                      total_records: result.length,
                      page: page,
                      sortOrder: body.sortOrder,
                      last: id,
                    };
                    deferred.resolve(obj, "last");
                  }

                  db.close();
                }
              });
          });
      }
    });
  }
  return deferred.promise;
};


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

/**
* This function is using to
* @param       :
* @returns     :
* @developer   :
* @ModifiedBy  :
*/
mongoObj.deleteData = async function (dataObj, tableName) {
  let deferred = q.defer();

  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      }

      let database = db.db(dbName);

      database.collection(tableName).deleteOne(dataObj, function (err, res) {
        if (err) {
          deferred.resolve(false);
        }
        if (res) {
          db.close();
          deferred.resolve(res);
        }
      });
    });
  }

  return deferred.promise;
};
/**
 * This function is using to
 * @param       :
 * @returns     :
 * @developer   :
 * @ModifiedBy  :
 */
mongoObj.deleteAllData = async function (dataObj, tableName) {
  let deferred = q.defer();
console.log(dataObj,"6666666666666666")
  if (dataObj && tableName) {

    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to server');
    const db         = client.db(dbName);
    const collection = db.collection(tableName);
    let result       = await collection.deleteMany(dataObj);

    if(result){

      deferred.resolve(true);

    }else{

      deferred.resolve(false);
    }
  }

  return deferred.promise;
};


/**
   * This function is used to get CHAT data from Mongo tables.
   * @param       :
   * @returns     :
   * @developer   :
   * @ModifiedBy  :
   */
mongoObj.getUsersConversationDetails = async function (dataObj, tableName) {

  let deferred = q.defer();

  if (dataObj && tableName) {

    MongoClient.connect(url, options, function (err, db) {

      if (err) {

        deferred.resolve(false);

      } else {

        let database = db.db(dbName),
          mysort = { '_id': 1 },
          sortBy = '',
          sortOrder = '',
          lastId = '',
          queryObj = '',
          recordsPerPage = 100,
          page = 0,
          query = {};

        if (dataObj.per_page) {
          recordsPerPage = dataObj.per_page;
        }

        if (dataObj.page) {
          page = dataObj.page;
        }

        if (dataObj.sortBy) {
          sortBy = dataObj.sortBy;
        }

        if (dataObj.sortOrder) {
          sortOrder = dataObj.sortOrder;
        }


        if (dataObj.last) {
          lastId = dataObj.last;
        }

        if (lastId) {
          query._id = { "$lte": lastId };
        }

        if (sortBy == '_id') {
          if (sortOrder == 'ASC') {
            mysort = { '_id': 1 };
          }
        }



        let offset = page * recordsPerPage;

        database.collection(tableName).find(dataObj).sort(mysort).toArray(function (err, result) {

          database.collection(tableName).find(dataObj).sort(mysort).skip(offset).limit(Number(recordsPerPage)).toArray(function (err, res) {

            if (err) {
              deferred.resolve([]);
            }

            if (res) {

              if ((dataObj.last) && dataObj.last != '') {

                database.collection(tableName).find(dataObj).sort(mysort).toArray(function (err, result1) {

                  let obj = {
                    data: res,
                    more_records: result1.length,
                    total_records: result.length,
                    last: result[0]['_id'],

                  };
                  deferred.resolve(obj);
                })
              } else {

                let id = '';

                if (res != '') {
                  id = res[0]['_id'];
                }

                let obj = {
                  data: res,
                  more_records: 0,
                  total_records: result.length,
                  last: id,
                };
                deferred.resolve(obj);
              }

              db.close();
            }
          });
        });
      }
    });
  }
  return deferred.promise;
}

/**
 * This function is using to
 * @param       :
 * @returns     :
 * @developer   :
 * @ModifiedBy  :
 */
mongoObj.updateManyData = async function (dataObj, tableName, updateObj) {
  let deferred = q.defer();

  if (dataObj && tableName && updateObj) {
    let newvalues = { $set: updateObj };

    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      }

      let database = db.db(dbName);

      database
        .collection(tableName)
        .updateMany(dataObj, newvalues, function (err, res) {
          if (err) {
            deferred.resolve(false);
          }

          if (res) {
            db.close();
            deferred.resolve(true);
          }
        });
    });
  }

  return deferred.promise;
};
module.exports = mongoObj;

