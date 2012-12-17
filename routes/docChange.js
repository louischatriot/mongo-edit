/**
 * Modify the contents of a document
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  , ObjectID = require('mongodb').ObjectID
  ;

module.exports = function (req, res, next) {
  var newDoc, collection;

  if (!req.params.collection || !req.params.id) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  newDoc = JSON.parse(req.body.newData);

  if (newDoc._id.toString() !== req.params.id) {
    return res.json(403, { message: '_id can\'t be modified' });
  }

  delete newDoc._id;   // Mongo won't be able to update the doc if it thinks we want to change it's _id

  collection = db.collection(req.params.collection);
  collection.update({ _id: new ObjectID(req.params.id) }, newDoc, { safe: true }, function (err) {
    if (err) {
      return res.json(403, err);
    }

    return res.redirect(config.websiteBase + '/');
  });

};
