var h4e = require('../')
  , path = require('path')
  ;

describe("Test h4e in standalone", function() {
	before(function(done) {
    if (path.basename(process.cwd()) !== 'test') {   // chdir into test if we're not already in it
      process.chdir('test');
    }

    h4e.setup({ extension: 'mustache'
              , baseDir: 'templates'
              , targets: ['.']
              });

    done();
	});

	it('Should support locals', function(done){
    var values = { planet: 'World'
                 , user: { username: 'Grafitti' }
                 }
      , t = h4e.render('onlyLocals', { values: values })
      ;
    t.should.equal('Hello <b>World</b> !\nYour username is Grafitti.\n');
		done();
	});

	it('should support directly rendering a string', function(done){
    var values = { animal: 'cats' }
      , t = h4e.render('I like {{animal}}.', { values: values })
      ;
    t.should.equal('I like cats.');
		done();
	});

  it('Should support partials', function(done){
    var values = { user: { username: 'Grafitti', species: 'cat', gender: 'female' } }
      , t = h4e.render('withPartials', { values: values })
      ;
    t.should.equal('Hello Grafitti.\nYou are a female cat.\n');
		done();
	});

  it('Should support usage of layouts', function(done){
    var values = { user: { username: 'Grafitti', species: 'cat', gender: 'female' } }
      , partials = { content: '{{>partials/description}}' }
      , t = h4e.render('layout', { values: values, partials: partials })
      ;
    t.should.equal('Header.\nYou are a female cat.\nFooter.\n');
		done();
	});

});
