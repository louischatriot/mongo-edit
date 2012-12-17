/**
 * Custom middlewares
 *
 */

var config = require('./config');

module.exports.commonRenderValues = function (req, res, next) {
  req.renderValues = {};
  req.renderValues.websiteBase = config.websiteBase;
  next();
}



