{
  // Example of an external config file
  // See lib/config.js for the explanation of all parameters
  // Note that the first line is a '{' because Mongo Edit will crash if the config file begins with a comment
  // Regex don't work well and I don't want to include a js-parser just for that
  db: { host: 'localhost'
      , port: 27017
      , name: 'dev-db'
      }
, svPort: 2763
, trustProxy: false
, templatesDir: 'templates'
, pagination: { resultsPerPage: 100, pagesAroundCurrent: 2 }
, baseUrl: ''
}
