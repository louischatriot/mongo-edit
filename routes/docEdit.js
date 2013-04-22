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
    , docId
    ;

  if (!req.params.collection || !req.params.id) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  try {
    docId = (req.params.id.length == 12 || req.params.id.match(/^[0-9a-f]{24}$/)) ? 
                                             ObjectID(req.params.id) : req.params.id;
  } catch (e) {
    return res.send(400, e.toString());
  }

  values.collectionName = req.params.collection;
  values._id = req.params.id;

  collection = db.collection(req.params.collection);
  collection.findOne({ _id: docId }, function (err, doc) {
    values.doc = serialization.serializeForGUI(doc);

    res.render('layout', { values: values
                         , partials: partials
                         });
  });

};


