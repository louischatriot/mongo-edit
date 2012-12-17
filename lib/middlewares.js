/**
 * Custom middlewares
 *
 */

var config = require('./config')
  , db = require('../lib/db')
  ;

module.exports.commonRenderValues = function (req, res, next) {
  req.renderValues = {};
  req.renderValues.websiteBase = config.websiteBase;

  db.collectionNames(function (err, _names) {
    var names = [];

    _names.forEach(function (name) {
      var candidate = name.name.replace(config.db.name + '.', '');

      // Push all user-defined collections
      if (candidate.substring(0, 7) !== 'system.') { names.push(candidate) }
    });
    names = names.sort();
    req.renderValues.collections = names;

    next();
  });
}



