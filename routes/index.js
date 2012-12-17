/**
 * Main route, displays the list of all collections
 *
 */

var config = require('../lib/config')
  , db = require('../lib/db')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/collections}}' }
    ;

  res.render('layout', { values: values
                       , partials: partials
                       });

};
