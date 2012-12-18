/**
 * Configuration
 */

var config = {}
  , env = process.env.NODE_ENV || 'development'
  ;

// Configuration common to all environments
config.templatesDir = 'templates';
config.pagination = { resultsPerPage: 100
                    , pagesAroundCurrent: 2   // 2 is a minimum in my opinion
                    };


switch(env) {
  case 'development':
    config.db = { host: 'localhost'
                , port: 27017
                , name: 'dev-db' };
    config.svPort = 2762;
    config.trustProxy = false;
    break;

  case 'production':
    config.db = { host: 'localhost'
                , port: 27017
                , name: 'prod-db' };
    config.svPort = 2762;
    config.trustProxy = true;   // You do have a reverse proxy to protect this in production, right?
    break;

  // Test environment, that uses a different database than the development database
  // so as not to pollute it.
  case 'test':
    config.db = { host: 'localhost'
                , port: 27017
                , name: 'test-db' };
    config.svPort = 2762;
    config.trustProxy = false;
    break;
}

module.exports = config;
