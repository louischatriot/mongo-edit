/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , mongodb = require('mongodb')
  , config = require('./lib/config')
  , db = new mongodb.Db( config.db.name
                       , new mongodb.Server(config.db.host, config.db.port, {})
                       , { w: 1 } )
  , app                    // Will store our express app
  //, routes = require('./lib/routes')
  , h4e = require('h4e');


app = express();

// Store db Instance in app. Avoid multiple instantiation in test files
//app.db = new DbObject( config.dbHost
                        //, config.dbName
                        //, config.dbPort
                        //);

// Set up templating
h4e.setup({ app: app
          , baseDir: config.templatesDir
          , toCompileDirs: ['.']
          , extension: 'mustache'
          });


/**
 * Middlewares
 *
 */

app.use(express.bodyParser());
//app.use(express.cookieParser());// Parse cookie data and use redis to store session data
app.use(app.router); // Map routes


/**
 * Routes for the API
 *
 */

// Email confirmation
app.get('/test', function(req, res, next) {
  var tldrs = db.collection('tldrs');
  tldrs.find({}).toArray(function (err, docs) {
    res.json(200, docs);
  });

});



/*
 * Connect to database, then start server
 */
app.launchServer = function (cb) {
  var callback = cb ? cb : function () {}
    , self = this;

  db.open(function (err) {
    if (err) { return callback(err); }

    self.apiServer = http.createServer(self);   // Let's not call it 'server' we never know if express will want to use this variable!

    // Handle any connection error gracefully
    self.apiServer.on('error', function () {
      console.log("An error occured while launching the server, probably a server is already running on the same port!");
      process.exit(1);
    });

    // Begin to listen. If the callback gets called, it means the server was successfully launched
    self.apiServer.listen.apply(self.apiServer, [config.svPort, function() {
      console.log('Server started');
      callback();
    }]);
  });
};


/*
 * Stop the server and then close the connection to the database
 * No new connections will be accepted but existing ones will be served before closing
 */
app.stopServer = function (cb) {
  var callback = cb ? cb : function () {}
    , self = this;

  self.apiServer.close(function () {
    db.close();
    console.log('Server was stopped and connection to the database closed');
    callback();
  });
};


/*
 * If we executed this module directly, launch the server.
 * If not, let the module which required server.js launch it.
 */
if (module.parent === null) { // Code to execute only when running as main
  app.launchServer();
}


/*
 * If SIGINT is received (from Ctrl+C or from Upstart), gracefully stop the server then exit the process
 * FOR NOW: commented out because browsers use hanging connections so every shutdown actually takes a few seconds (~5) if a browser connected to the server
 *          which makes for a way too long restart
 */
//process.on('SIGINT', function () {
  //app.stopServer(function () {
    //bunyan.info('Exiting process');
    //process.exit(0);
  //});
//});



// exports
module.exports = app;

