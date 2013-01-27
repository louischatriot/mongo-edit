// Example of an external config file
// See lib/config.js for the explanation of all parameters
{
  db: { host: 'localhost'
      , port: 27017
      , name: 'dev-db'
      }
, svPort: 2763
, trustProxy: false
, templatesDir: 'templates'
, pagination: { resultsPerPage: 100, pagesAroundCurrent: 2 }
}
