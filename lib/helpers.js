var ObjectID = require('mongodb').ObjectID
  , db = require('../lib/db')
  , async = require('async')
  ;


/**
 * From a stringId, return an id that corresponds to an object in the DB (if possible)
 * We try to match these criteria, in order: ObjectId, string, number
 * If your DB uses its ids in a coherent way (e.g. only ObjectIds or only string)
 * this will always work. It may not work if you have two different ids with the same
 * string representation, e.g. 42 (number) and "42" (string). But I think you just
 * shouldn't do such a thing!
 *
 * @param {String} collectionName
 * @param {String} stringId String representation of the id we're looking for
 * @param {Function} callback Signature: err, id
 */
module.exports.getIdFromStringId = function (collectionName, stringId, callback) {
  // Try an id, stop execution if it works, continue looking if it doesn't
  function tryId(id, cb) {
    collection = db.collection(collectionName);
    collection.findOne({ _id: id }, function (err, doc) {
      if (!err && doc) {
        return callback(null, id);
      } else {
        return cb();
      }
    });
  }

  async.waterfall([
  function (cb) {   // Try ObjectId
    var id;
    try {
      id = new ObjectID(stringId);
    } catch (e) {
      return cb();
    }

    tryId(id, cb);
  }
  , async.apply(tryId, stringId)   // Try string
  , async.apply(tryId, parseFloat(stringId))   // Try number
  ], function () { return callback('No match found'); });
};


/**
 * Check that two ids are equal
 * They can be ObjectIds, strings or numbers as in getIdFromStringId
 */
module.exports.areIdsEqual = function (id1, id2) {
  if (id1.constructor && id1.constructor.name === 'ObjectID') {
    return id2.constructor && id2.constructor.name === 'ObjectID' && id1.toString() === id2.toString();
  } else {
    return id1 === id2;
  }
};
