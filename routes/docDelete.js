/**
 * Delete a document
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  , ObjectID = require('mongodb').ObjectID
  , serialization = require('../lib/serialization')
  , helpers = require('../lib/helpers')
  ;

module.exports = function (req, res, next) {
  var collection;

  if (!req.params.collection || !req.params.id) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  helpers.getIdFromStringId(req.params.collection, req.params.id, function (err, id) {
    if (err) { return res.send(400, err); }

    collection = db.collection(req.params.collection);
    collection.remove({ _id: id }, { single: true, w:1 }, function (err) {
      if (err) { return res.json(403, err); }

      return res.redirect(config.baseUrl + '/' + req.params.collection + '?type=alert-success&message=The document was deleted, no turning back now!');
    });
  });
};

