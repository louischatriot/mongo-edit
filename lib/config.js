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
    break;

  case 'production':
    config.db = { host: 'localhost'
                , port: 27017
                , name: 'prod-db' };
    config.svPort = 2762;
    break;
}

module.exports = config;
