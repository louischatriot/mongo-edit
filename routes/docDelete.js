/**
 * Delete a document
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  , ObjectID = require('mongodb').ObjectID
  , serialization = require('../lib/serialization')
  ;

module.exports = function (req, res, next) {
  var collection;

  if (!req.params.collection || !req.params.id) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  collection = db.collection(req.params.collection);
  collection.remove({ _id: new ObjectID(req.params.id) }, { single: true, w:1 }, function (err) {
    if (err) { return res.json(403, err); }

    return res.redirect('/' + req.params.collection + '?type=alert-success&message=The document was deleted, no turning back now!');
  });

};

