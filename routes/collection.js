/**
 * Display the contents of a collection
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  ;

module.exports = function (req, res, next) {
  var values = {}
    , partials = { content: '{{>pages/collection}}' }
    , collection
    ;

  if (!req.params.collection) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  values.collectionName = req.params.collection;

  collection = db.collection(req.params.collection);
  collection.find({}).toArray(function (err, docs) {
    var contents = [];

    docs.forEach(function (doc) {
      contents.push({ doc: JSON.stringify(doc)
                    , _id: doc._id });
    });

    values.contents = contents;

    res.render('layout', { values: values
                         , partials: partials
                         });
  });

};

