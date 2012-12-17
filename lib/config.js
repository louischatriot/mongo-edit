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
    config.svPort = 2761;
    config.websiteBase = 'http://localhost:2762';
    config.resultsPerPage = 0;
    break;


}

module.exports = config;
