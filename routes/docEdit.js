/**
 * Display an editor to modify a document
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  , ObjectID = require('mongodb').ObjectID
  , serialization = require('../lib/serialization')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/docEdit}}' }
    , collection
    ;

  if (!req.params.collection || !req.params.id) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  values.collectionName = req.params.collection;
  values._id = req.params.id;

  collection = db.collection(req.params.collection);
  
  collection.findOne({ _id: req.params.id.length != 24 ? req.params.id : new ObjectID(req.params.id) }, function (err, doc) {
    values.doc = serialization.serializeForGUI(doc);

    res.render('layout', { values: values
                         , partials: partials
                         });
  });

};


