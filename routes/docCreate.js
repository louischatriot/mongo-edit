/**
 * Create a new document
 * All fields are empty except indexed ones (the document wouldn't be saved otherwise)
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  , crypto = require('crypto')
  , serialization = require('../lib/serialization')
  ;

module.exports = function (req, res, next) {
  var newDoc = {}
    , collection;

  if (!req.params.collection) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  collection = db.collection(req.params.collection);

  collection.indexInformation(function (err, data) {
    Object.keys(data).forEach(function (key) {
      if (data[key][0][0] !== '_id') {
        newDoc[data[key][0][0]] = crypto.randomBytes(Math.ceil(9)).toString('base64').slice(0, 12) + ' - This is a unique field so here is a uniquely generated string, replace it by whatever';
      }
    });

    collection.insert(newDoc, { safe: true }, function (err, docs) {
      if (err) { return res.json(403, { message: 'Something strange happened', error: err }); }

      return res.redirect(config.relative + req.params.collection + '/' + docs[0]._id + '/edit?type=alert-success&message=The document was successfully created and persisted to the database, you can edit it now');
    });
  });


};

