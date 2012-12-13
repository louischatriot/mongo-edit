var h4e = require('../')
  , path = require('path')
  , express = require('express')
  , http = require('http')
  , app = require('express')
  , request = require('request')
  , testHandler = function (req, res, next) {}   // stub
  ;

// The actual tests are defined at first here because we use them twice (for automatic setup and Express native way)
function shouldSupportLocals(done) {
  testHandler = function (req, res, next) {
    var values = { planet: "World"
                 , user: { username: 'Grafitti' }
                 };
    res.render('onlyLocals', { values: values });
  };

  request.get({ headers: {"Accept": "application/json"}
              , uri: 'http://localhost:8686/test' }, function (error, response, body) {
    response.statusCode.should.equal(200);
    body.should.equal('Hello <b>World</b> !\nYour username is Grafitti.\n');
    done();
  });
}

function shouldSupportPartials (done) {
  testHandler = function (req, res, next) {
    var values = { user: { username: 'Grafitti', species: 'cat', gender: 'female' }
                 };
    res.render('withPartials', { values: values });
  };

  request.get({ headers: {"Accept": "application/json"}
              , uri: 'http://localhost:8686/test' }, function (error, response, body) {
    response.statusCode.should.equal(200);
    body.should.equal('Hello Grafitti.\nYou are a female cat.\n');
    done();
  });
}

function shouldEnableLayouts (done) {
  // We will render layout.mustache with the partial partials/description as the content
  testHandler = function (req, res, next) {
    var values = { user: { username: 'Grafitti', species: 'cat', gender: 'female' }
                 }
      , partials = { content: '{{>partials/description}}' }
      ;
    res.render('layout', { values: values, partials: partials });
  };

  request.get({ headers: {"Accept": "application/json"}
              , uri: 'http://localhost:8686/test' }, function (error, response, body) {
    response.statusCode.should.equal(200);
    body.should.equal('Header.\nYou are a female cat.\nFooter.\n');
    done();
  });
}


// Needed to stop and start the server cleanly, because we want the Express app to be reinitialized
// for each of two test suites, but we don't like EADDRINUSE errors
function launchServer (expressApp, cb) {
  var callback = cb ? cb : function () {}
    , self = expressApp;

  self.apiServer = http.createServer(self);

  // Handle any connection error gracefully
  self.apiServer.on('error', function () {
    console.log("An error occured while launching the server, probably a server is already running on the same port!");
    process.exit(1);
  });

  // Begin to listen. If the callback gets called, it means the server was successfully launched
  self.apiServer.listen.apply(self.apiServer, [8686, function() {
    console.log("Server launched, listening");
    callback();
  }]);
};

function stopServer (expressApp, cb) {
  var callback = cb ? cb : function () {}
    , self = expressApp;

  self.apiServer.close(function () {
    console.log("Server closed");
    callback();
  });
};




// Test suites
describe("Test h4e with Express and the automatic setup", function() {
  before(function(done) {
    if (path.basename(process.cwd()) !== 'test') {   // chdir into test if we're not already in it
      process.chdir('test');
    }

    app = express();   // New app
    app.use(app.router);
    app.get('/test', function (req, res, next) { testHandler(req, res, next); });

    h4e.setup({ app: app
              , extension: 'mustache'
              , baseDir: 'templates'
              , targets: ['.']
              });

    launchServer(app, done);
  });

  after(function(done) {
    stopServer(app, done);
  });

  it('Should support locals', shouldSupportLocals);
  it('Should support partials', shouldSupportPartials);
  it('Should enable usage of layouts', shouldEnableLayouts);
});

describe("Test h4e with standard Express setup", function() {
	before(function(done) {
    var render;

    if (path.basename(process.cwd()) !== 'test') {   // chdir into test if we're not already in it
      process.chdir('test');
    }

    app = express();   // New app
    app.use(app.router);
    app.get('/test', function (req, res, next) { testHandler(req, res, next); });

    render = h4e.setup({ extension: 'mustache'
                       , baseDir: 'templates'
                       , targets: ['.']
                       });
    app.engine('mustache', render);
    app.set('view engine', 'mustache');
    app.set('views', 'templates');

    launchServer(app, done);
	});

  after(function(done) {
    stopServer(app, done);
  });

	it('Should support locals', shouldSupportLocals);
  it('Should support partials', shouldSupportPartials);
  it('Should enable usage of layouts', shouldEnableLayouts);
});

