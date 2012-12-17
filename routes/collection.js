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
    ;

  if (!req.params.collection) {
    return res.json(404, { message: 'Wrong URL format' });
  }

  values.collectionName = req.params.collection;

  collection = db.collection(req.params.collection);

  collection.count(function (err, count) {
    var numPages, i;

    // Enable pagination
    if (config.pagination.resultsPerPage > 0 || !showAll) {


      values.pagination = {};
      numPages = Math.floor(count / config.pagination.resultsPerPage) + 1;

      if (numPages <= config.pagination.maxPagesToShowAll) {
        values.pagination.pages = [];
        for (i = 1; i <= numPages; i += 1) { values.pagination.pages.push(i); }
      }


    }

    collection.find({})
              .sort({ _id: -1 })
              //.limit(config.pagination.resultsPerPage)
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

