/**
 * Display an editor to modify a document
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  , ObjectID = require('mongodb').ObjectID
  , serialization = require('../lib/serialization')
  , helpers = require('../lib/helpers')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/docEdit}}' }
    , collection
    , docId
    ;

  if (!req.params.collection || !req.params.id) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  helpers.getIdFromStringId(req.params.collection, req.params.id, function (err, id) {
    if (err) { return res.send(400, err); }

    values.collectionName = req.params.collection;
    values._id = id;

    collection = db.collection(req.params.collection);
    collection.findOne({ _id: id }, function (err, doc) {
      values.doc = serialization.serializeForGUI(doc);

      res.render('layout', { values: values
                           , partials: partials
                           });
    });
  });
};


