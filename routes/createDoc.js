/**
 * Create a new empty document
 * Works for now only if there is no 'unique' or 'required' constraint
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  , ObjectID = require('mongodb').ObjectID
  , serialization = require('../lib/serialization')
  ;

module.exports = function (req, res, next) {
  var newDoc, collection;

  if (!req.params.collection) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  collection = db.collection(req.params.collection);
  collection.insert({}, { safe: true }, function (err, docs) {
    if (err) { return res.json(403, err); }

    return res.redirect('/' + req.params.collection + '/' + docs[0]._id + '/edit');
  });
};

