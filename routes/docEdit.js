/**
 * Display an editor to modify a document
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  , ObjectID = require('mongodb').ObjectID
  , beautify = require('../lib/js-beautify').js_beautify
  ;

module.exports = function (req, res, next) {
  var values = {}
    , partials = { content: '{{>pages/docEdit}}' }
    , collection
    ;

  if (!req.params.collection || !req.params.id) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  values.collectionName = req.params.collection;
  values._id = req.params.id;

  collection = db.collection(req.params.collection);
  collection.findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
    values.doc = beautify(JSON.stringify(doc));

    res.render('layout', { values: values
                         , partials: partials
                         });
  });

};


