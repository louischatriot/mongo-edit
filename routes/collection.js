/**
 * Display the contents of a collection
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/collection}}' }
    , collection
    , showAll = req.query.page === 'all'
    , page = showAll ? 0 : (req.query.page || 1)
    , results = showAll ? 0 : config.pagination.resultsPerPage
    ;

  if (!req.params.collection) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  values.collectionName = req.params.collection;

  collection = db.collection(req.params.collection);

  collection.count(function (err, count) {
    var numPages, i;

    // Enable pagination
    if (results > 0 && count > results) {
      values.pagination = {};
      numPages = Math.ceil(count / config.pagination.resultsPerPage);

      if (numPages <= config.pagination.maxPagesToShowAll) {
        values.pagination.pages = [];
        for (i = 1; i <= numPages; i += 1) {
          values.pagination.pages.push({ pageNumber: i
                                       , active: i.toString() === page.toString() });
        }
      }
    }

    collection.find({})
              .sort({ _id: -1 })
              .limit(results).skip((page - 1) * results)
              .toArray(function (err, docs) {
      var contents = [];

      docs.forEach(function (doc) {
        contents.push({ doc: JSON.stringify(doc, undefined, 2)
                      , _id: doc._id });
      });

      values.contents = contents;

      res.render('layout', { values: values
                           , partials: partials
                           });
  });

  });

};

