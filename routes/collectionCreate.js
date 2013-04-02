/**
 * Create a new empty collection
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  , serialization = require('../lib/serialization')
  ;

module.exports = function (req, res, next) {
  var newDoc = {}
    , collection;

  if (!req.params.collection) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  db.createCollection(req.params.collection, {}, function (err) {
    if (err) { return res.json(403, { message: 'Something strange happened', error: err }); }

    return res.redirect(config.baseUrl + '/' + req.params.collection + '?type=alert-success&message=The collection was successfully created');
  });
};
