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
    , page = parseInt(showAll ? 0 : (req.query.page || 1))
    , results = showAll ? 0 : config.pagination.resultsPerPage
    ;

  if (!req.params.collection) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  values.collectionName = req.params.collection;

  collection = db.collection(req.params.collection);

  collection.count(function (err, count) {
    var numPages, i
      ;

    // Enable pagination
    if (results > 0 && count > results) {
      values.pagination = {};
      numPages = Math.ceil(count / config.pagination.resultsPerPage);
      values.pagination.prev = Math.max(1, page - 1);
      values.pagination.next = Math.min(numPages, page + 1);

      values.pagination.pages = [];
      if (numPages <= config.pagination.maxPagesToShowAll) {
        for (i = 1; i <= numPages; i += 1) {
          values.pagination.pages.push({ pageNumber: i
                                       , label: i
                                       , active: i === page });
        }
      } else {
        values.pagination.pages.push({ pageNumber: 1, label: 1, active: 1 === page });

        if (page - Math.floor(config.pagination.maxPagesToShowAll / 2) > 2) {
          values.pagination.pages.push({ pageNumber: Math.floor((1 + page) / 2), label: '...' });
        }

        for (i = Math.max(2, page - Math.floor(config.pagination.maxPagesToShowAll / 2));
             i <= Math.min(numPages - 1, page + Math.floor(config.pagination.maxPagesToShowAll / 2));
             i += 1) {
          values.pagination.pages.push({ pageNumber: i, label: i, active: i === page });
        }

        if (page + Math.floor(config.pagination.maxPagesToShowAll / 2) < numPages - 1) {
          values.pagination.pages.push({ pageNumber: Math.floor((numPages + page) / 2), label: '...' });
        }

        values.pagination.pages.push({ pageNumber: numPages, label: numPages, active: numPages === page });
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

