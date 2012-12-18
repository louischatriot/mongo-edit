/**
 * Configuration
 */

var config = {}
  , env = process.env.NODE_ENV || 'development'
  ;

// Configuration common to all environments
config.templatesDir = 'templates';


switch(env) {
  case 'development':
    config.db = { host: 'localhost'
                , port: 27017
                , name: 'dev-db' };
    config.svPort = 2762;
    config.pagination = { resultsPerPage: 1
                        , pagesAroundCurrent: 2   // 2 is a minimum in my opinion
                        };
    break;


}

module.exports = config;
