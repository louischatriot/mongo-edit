/**
 * Modify the contents of a document
 *
 */

var config = require('../lib/config');

module.exports = function (req, res, next) {

  console.log('-------');
  console.log(req.body);

  res.redirect(config.websiteBase + '/');
};
