/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , config = require('./lib/config')
  , db = require('./lib/db')
  , app                    // Will store our express app
  , routes = require('./routes/routes')
  , middlewares = require('./lib/middlewares')
  , h4e = require('h4e');


app = express();

if (config.trustProxy) {
  app.enable('trust proxy');
}

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
app.use(middlewares.commonRenderValues);
app.use(app.router); // Map routes


// Serving static files from paths that can't be confused with the webpages
app.get('/assets/css/:file', express.static(__dirname));
app.get('/assets/jquery/:file', express.static(__dirname));
app.get('/assets/ace/:file', express.static(__dirname));
app.get('/assets/bootstrap/:dir/:file', express.static(__dirname));
app.get('/favicon.ico', function (req, res, next) { return res.send(404); });   // No favicon

// Serve the webpages
app.get('/', routes.index);
app.get('/:collection', routes.collection);
app.get('/:collection/new', routes.collectionCreate);
app.get('/:collection/delete', routes.collectionDelete);

app.get('/:collection/newDocument', routes.docCreate);
app.get('/:collection/:id/edit', routes.docEdit);
app.get('/:collection/:id/delete', routes.docDelete);
app.post('/:collection/:id', routes.docChange);



/*
 * Connect to database, then start server
 */
app.launchServer = function (cb) {
  var callback = cb ? cb : function () {}
    , self = this
    ;

  db.connectToChosenDatabase(function (err) {
    if (err) { return callback(err); }

    self.apiServer = http.createServer(self);   // Let's not call it 'server' we never know if Express will want to use this variable!

    // Handle any connection error gracefully
    self.apiServer.on('error', function () {
      return callback("An error occured while launching the server, probably a server is already running on the same port!");
    });

    // Begin to listen. If the callback gets called, it means the server was successfully launched
    self.apiServer.listen.apply(self.apiServer, [config.svPort, callback]);
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
  app.launchServer(function (err) {
    if (err) {
      console.log("An error occured, logging error and stopping the server");
      console.log(err);
      process.exit(1);
    } else {
      console.log('Server started on port ' + config.svPort);
    }
  });
}


/*
 * If SIGINT is received (from Ctrl+C or from Upstart), gracefully stop the server then exit the process
 * FOR NOW: commented out because browsers use hanging connections so every shutdown actually takes a few seconds (~5) if a browser connected to the server
 *          which makes for a way too long restart
 */
//process.on('SIGINT', function () {
  //app.stopServer(function () {
    //console.log('Exiting process');
    //process.exit(0);
  //});
//});



// exports
module.exports = app;

