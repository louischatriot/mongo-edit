/**
 * Custom middlewares
 *
 */

var config = require('./config')
  , db = require('../lib/db')
  ;

/**
 * Ensure we have a connection to the database, so that Mongo Edit doesn't crash
 * Useful when mongodb was restarted and the connection was cut
 */
module.exports.ensureConnectionToMongo = function (req, res, next) {
  if (db.serverConfig.allRawConnections().length > 0) { return next(); }

  // No active connection, reconnect to database
  db.connectToChosenDatabase(function (err) {
    if (err) { return res.send(500, err); }

    return next();
  });
};


/**
 * Calculate the values used in all pages, e.g. all collections names
 */
module.exports.commonRenderValues = function (req, res, next) {
  req.renderValues = { baseUrl: config.baseUrl };

  if (req.query.message) {
    req.renderValues.alert = {};
    req.renderValues.alert.type = req.query.type;
    req.renderValues.alert.message = req.query.message;
  }

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
};



