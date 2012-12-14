var config = require('./config')
  , mongodb = require('mongodb')
  ;

module.exports = new mongodb.Db( config.db.name
                               , new mongodb.Server(config.db.host, config.db.port, {})
                               , { w: 1 } );
