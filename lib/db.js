var config = require('./config')
  , mongodb = require('mongodb')
  , db
  ;



db = new mongodb.Db( config.db.name
                   , new mongodb.Server(config.db.host, config.db.port, {})
                   , { w: 1 } );


/**
 * Connect to the database corresponding to the chosen environment
 * Try to connect as an authenticated user if the environment declares
 * a username and password in config.db
 *
 */
db.connectToChosenDatabase = function (cb) {
  var self = this
    , callback = cb || function () {}
    ;

  self.open(function (err) {
    if (err) { return callback("Error connecting to the DB"); }

    if (! config.db.username || ! config.db.password) {
      return callback();
    }

    self.authenticate(config.db.username, config.db.password, function(err, success) {
      if (err) { return callback("Error authenticating to the DB"); }
      return callback();
    });
  });
};

module.exports = db;
