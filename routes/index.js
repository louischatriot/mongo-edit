/**
 * Main route, displays the list of all collections
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  ;

module.exports = function (req, res, next) {
  var values = {}
    , partials = { content: '{{>pages/collections}}' }
    ;

  db.collectionNames(function (err, _names) {
    var names = [];

    _names.forEach(function (name) {
      var candidate = name.name.replace(config.db.name + '.', '');

      // Push all user-defined collections
      if (candidate.substring(0, 7) !== 'system.') { names.push(candidate) }
    });
    names = names.sort();
    values.collections = names;

    res.render('layout', { values: values
                         , partials: partials
                         });
  });

};
