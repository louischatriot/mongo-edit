/**
 * There are two ways to launch Mongo Edit
 * 1) Using an external config file containing the config object (must be valid javascript!)
 *    'node server.js path/to/yourconfigfile.js' to load an external config file
 *
 * 2) In one of the environments defined below (you can add as many as you want)
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
 */

var config = {}
  , fs = require('fs')
  , env = process.env.NODE_ENV || 'development'
  , configFileName, configFileContent, f
  ;


if (process.argv.length > 2) {
  // Mongo Edit was launched with an argument, which must be the path to an external config file
  // Try to read and parse it. If an error happens, log it and exit
  configFileName = process.argv[2];
  try {
    configFileContent = fs.readFileSync(configFileName, 'utf8');
  } catch (e) {
    console.log("Couldn't read the config file, error given: ", e);
    process.exit(1);
  }

  try {
    f = new Function('return ' + configFileContent);
    config = f();
  } catch (e) {
    console.log("Couldn't process the config file, probably not a valid javascript object. Error given: ", e);
    process.exit(1);
  }
} else {
  // Mongo Edit was launched without an argument.
  // Select config corresponding to the environment
  switch(env) {
    // Example of a dev environment where you don't need credentials to connect to the database
    case 'development':
      config.db = { host: 'localhost'
                  , port: 27017
                  , name: 'dev-db' };
      config.svPort = 2762;
      config.trustProxy = false;
      config.templatesDir = 'templates';
      config.pagination = { resultsPerPage: 100 , pagesAroundCurrent: 2 };
      break;

    // Example of a prod environment running in a trusted environment (i.e. the firewall
    // blocks all requests to port 27017 so no credentials are required) behind a reverse proxy
    case 'production':
      config.db = { host: 'localhost'
                  , port: 27017
                  , name: 'prod-db'
                  };
      config.svPort = 2762;
      config.trustProxy = true;   // You do have a reverse proxy to protect this in production, right?
      config.templatesDir = 'templates';
      config.pagination = { resultsPerPage: 100 , pagesAroundCurrent: 2 };
      break;

    // Example of a config where you authenticate as user 'sample-username'
    case 'authenticated':
      config.db = { host: 'localhost'
                  , port: 27017
                  , name: 'dev-db'
                  , username: 'sample-username'
                  , password: 'sample-password' };
      config.svPort = 2762;
      config.trustProxy = false;
      config.templatesDir = 'templates';
      config.pagination = { resultsPerPage: 100 , pagesAroundCurrent: 2 };
      break;

    // Test environment, that uses a different database than the dev/prod databases
    // so as not to pollute them. This environment is necessary to execute tests
    case 'test':
      config.db = { host: 'localhost'
                  , port: 27017
                  , name: 'test-db' };
      config.svPort = 2762;
      config.trustProxy = false;
      config.templatesDir = 'templates';
      config.pagination = { resultsPerPage: 100 , pagesAroundCurrent: 2 };
      break;
  }
}


module.exports = config;
