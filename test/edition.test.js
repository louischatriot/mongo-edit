/**
 * The only part that really needs to be tested is the edition part
 * since it is the only one that can potentially damage the database
 *
*/


var should = require('chai').should()
  , assert = require('chai').assert
  //, app = require('../server')
	, serialization = require('../lib/serialization')
  , ObjectID = require('mongodb').ObjectID
  , db = require('../lib/db')
  //, request = require('request')
	;


describe('Data types should be preserved when going through toJson then fromJson', function () {

	before(function (done) {
		db.open(function (err) {
			if (err) { return done(err); }

			// Start with a clean DB
			db.dropDatabase(done);
		});
		//app.launchServer(done);
	});

	after(function (done) {
		db.close(done);
		//app.stopServer(done);
	});

	it('Strings and numbers', function (done) {
		var obj = { stringKey: "Some string"
			        , numberKey: 12
              , shittyString: 'This one contains "double quotes" that must be escaped'
		          }
	    , collection = db.collection('test');
      ;

	  collection.insert(obj, function (err, docs) {
      var res = serialization.deserializeFromGUI(serialization.serializeForGUI(docs[0]));

      res.stringKey.should.be.a('string');
      res.shittyString.should.be.a('string');
      res.shittyString.should.equal('This one contains "double quotes" that must be escaped');
      res.numberKey.should.be.a('number');

			done();
		});
	});

	it('Date', function (done) {
		var obj = { dateKey: new Date()
		          }
	    , collection = db.collection('test');
      ;

	  collection.insert(obj, function (err, docs) {
      var res = serialization.deserializeFromGUI(serialization.serializeForGUI(docs[0]));

			res.dateKey.constructor.name.should.equal('Date');
		
			done();
		});
	});

	it('ObjectId', function (done) {
		var obj = { objectIdKey: new ObjectID('123456789009876543211234')
		          }
	    , collection = db.collection('test');
      ;

	  collection.insert(obj, function (err, docs) {
      var res = serialization.deserializeFromGUI(serialization.serializeForGUI(docs[0]));

      res.objectIdKey.constructor.name.should.equal('ObjectID');
		
			done();
		});
	});

});
