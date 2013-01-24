/**
 * Configuration
 * You can add as many environments as you want, as long as
 * the exported config object contains the following properties:
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
 *           * username, password (Optional): credentials to use if your Mongo instance is secured
 *                                            by a login/password database. If you don't define them (or set them to
 *                                            undefined or null), Mongo Edit won't try to authenticate requests to the db.
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
                , name: 'prod-db'
                };
    config.svPort = 2762;
    config.trustProxy = true;   // You do have a reverse proxy to protect this in production, right?
    break;

  // Example of a config where you need credentials to connect to the database
  case 'authenticated':
    config.db = { host: 'localhost'
                , port: 27017
                , name: 'prod-db'
                , username: 'prod-username'
                , password: 'prod-password' };
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
