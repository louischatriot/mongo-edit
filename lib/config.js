/**
 * There are two ways to launch Mongo Edit
 * This is a bit stupid and due to legacy reasons, I will switch to external config file only in a later release
 * 1) PREFERRED: Using an external config file containing the config object (must be valid javascript!)
 *    This is the preferred method if you cloned the Github repo as you'll be able to update
 *    with a simple git pull with your config staying unchanged
 *    'node server.js config/sampleConfig.js' to use the sample config file provided
 *
 * 2) Alternatively, you can use one of the default configurations by specifying an environment
 *    You can add as many environments as you want, you can find four examples below
 *    Keep in mind that the default configs are reset everytime you get Mongo Edit from Github or npm
 *   'NODE_ENV=theEnv node server.js' to launch in environment 'theEnv'
 *   'node server.js' to launch in the default ('development') environment
 *
 * Whether coming from an external config file or defined here, the exported config object
 * must contain the following properties:
 *   * templatesDir: the directory holding the templates (you shouldn't need to change this)
 *   * pagination: object holding the two parameters (resultsPerPage and pagesAroundCurrent)
 *                 for the pagination (you shouldn't need to change this either)
 *   * svPort: the port on which the Express server will be launched
 *   * trustProxy: set it to true if you are running behind a reverse proxy such as Nginx.
 *                 That should be the case if you use Mongo Edit with your production database
 *                 on a server accessible from the outside (the best and easiest is to secure
 *                 all calls to Mongo Edit by a Basic Auth over SSL).
 *   * db: object holding all the information necessary to connect to your Mongo database:
 *           * host: host on which the database runs (localhost if you run Mongo Edit on the same server as the Mongo instance)
 *           * port: port on which the Mongo instance accepts connections
 *           * name: name of the database to use
 *           * username, password (Optional): if specified, authenticate as the corresponding user
 *                                            if not specified, don't (in that case, Mongo Edit
 *                                            won't work if the Mongo daemon was launched with the --auth option)
 *   * baseUrl: a prefix to run Mongo Edit like this: http://example.com/baseUrl/[usual Mongo Edit urls here].
 *     Must be of form /somePrefix (begin but not end with a slash)
 */

var config = {}
  , defaultConfigs = {}
  , fs = require('fs')
  , env = process.env.NODE_ENV || 'development'
  , configFileName, configFileContent, f
  ;


/**
 * Define default configurations to be used if Mongo Edit is launched with option 2)
 *
 */

// Example of a dev environment where you don't need credentials to connect to the database
defaultConfigs.development = { svPort: 2762
                             , trustProxy: false
                             , db: { host: 'localhost'
                                   , port: 27017
                                   , name: 'dev-db'
                                   }
                             , templatesDir: 'templates'
                             , pagination: { resultsPerPage: 100, pagesAroundCurrent: 2 }
                             , baseUrl: ''
                             };

// Example of a prod environment running in a trusted environment (i.e. the firewall
// blocks all requests to port 27017 so no credentials are required) behind a reverse proxy
defaultConfigs.production = { svPort: 2762
                            , trustProxy: true
                            , db: { host: 'localhost'
                                  , port: 27017
                                  , name: 'prod-db'
                                  }
                            , templatesDir: 'templates'
                            , pagination: { resultsPerPage: 100, pagesAroundCurrent: 2 }
                            , baseUrl: ''
                            };

// Example of a config where you authenticate as user 'sample-username'
defaultConfigs.authenticated = { svPort: 2762
                               , trustProxy: false
                               , db: { host: 'localhost'
                                     , port: 27017
                                     , name: 'dev-db'
                                     , username: 'sample-username'
                                     , password: 'sample-password'
                                     }
                               , templatesDir: 'templates'
                               , pagination: { resultsPerPage: 100, pagesAroundCurrent: 2 }
                               , baseUrl: '/somePrefix'
                               };

// Test environment, that uses a different database than the dev/prod databases
// so as not to pollute them. This environment is necessary to execute tests
// If you run the tests make sure you don't use a 'test-db' database, it will be erased
defaultConfigs.test = { svPort: 2762
                      , trustProxy: false
                      , db: { host: 'localhost'
                            , port: 27017
                            , name: 'test-db'
                            }
                      , templatesDir: 'templates'
                      , pagination: { resultsPerPage: 100, pagesAroundCurrent: 2 }
                      , baseUrl: ''
                      };


/**
 * Selecting the right config object
 *
 */
if (process.argv.length > 2 && env !== 'test') {
  // Mongo Edit was launched with an argument, which must be the path to an external config file
  // Try to read and parse it. If an error happens, log it and exit
  try {
    configFileName = process.argv[2];
    configFileContent = fs.readFileSync(configFileName, 'utf8');
    f = new Function('return ' + configFileContent);
    config = f();
  } catch (e) {
    console.log("Problem reading or parsing the config file, error given: ", e);
    process.exit(1);
  }
} else {
  // Mongo Edit was launched without an argument.
  // Select config corresponding to the environment
  config = defaultConfigs[env];
}


// Defaults (useful especially for retrocompatibility)
config.svPort = config.svPort || 2762;
config.trustProxy = config.trustProxy || true;
config.db = config.db || { host: 'localhost', port: 27017, name: 'test-db' };
config.templates = config.templatesDir || 'templates';
config.pagination = config.pagination || { resultsPerPage: 100, pagesAroundCurrent: 2 };
config.baseUrl = config.baseUrl || '';


module.exports = config;
