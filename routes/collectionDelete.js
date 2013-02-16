/**
 * Delete a collection
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  , ObjectID = require('mongodb').ObjectID
  , serialization = require('../lib/serialization')
  ;

module.exports = function (req, res, next) {
  var collection;

  if (!req.params.collection) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  collection = db.collection(req.params.collection);
  collection.drop(function (err) {
    if (err) { return res.json(403, err); }

    return res.redirect(config.relative + '?type=alert-success&message=The collection ' + req.params.collection + ' was deleted, no turning back now!');
  });

};

