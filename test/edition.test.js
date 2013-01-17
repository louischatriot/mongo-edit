/**
 * The only part that really needs to be tested is the edition part
 * since it is the only one that can potentially damage the database
 *
*/


var should = require('chai').should()
  , assert = require('chai').assert
	, serialization = require('../lib/serialization')
  , ObjectID = require('mongodb').ObjectID
  , DBRef = require('mongodb').DBRef
  , db = require('../lib/db')
	;


describe('Data types should be preserved when serializing then deserializing', function () {

	before(function (done) {
		db.open(function (err) {
			if (err) { return done(err); }

			// Start with a clean DB
			db.dropDatabase(done);
		});
	});

	after(function (done) {
		db.close(done);
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

	it('Nested objects', function (done) {
		var obj = { someNumber: 32
              , nestedObject: { someobjectId: new ObjectID('123456789009876543211234')
                , someText: "blah blah blah"
                , someNumber: 1
                }
		          }
	    , collection = db.collection('test');
      ;

	  collection.insert(obj, function (err, docs) {
      var res = serialization.deserializeFromGUI(serialization.serializeForGUI(docs[0]));

      res.nestedObject.someobjectId.constructor.name.should.equal('ObjectID');
      res.nestedObject.someText.should.equal("blah blah blah");
      res.nestedObject.someNumber.should.equal(1);
		
			done();
		});
	});

	it('Nested Arrays', function (done) {
		var obj = { someNumber: 32
              , nestedObject: { someobjectId: new ObjectID('123456789009876543211234')
                , nestedArray: [1, 6, 3, 8, 4]
                , someNumber: 1
                }
		          }
	    , collection = db.collection('test');
      ;

	  collection.insert(obj, function (err, docs) {
      var res = serialization.deserializeFromGUI(serialization.serializeForGUI(docs[0]));

      res.nestedObject.nestedArray.length.should.equal(5);
      res.nestedObject.nestedArray[0].should.equal(1);
      res.nestedObject.nestedArray[1].should.equal(6);
      res.nestedObject.nestedArray[2].should.equal(3);
      res.nestedObject.nestedArray[3].should.equal(8);
      res.nestedObject.nestedArray[4].should.equal(4);

      done();
		});
	});

	it('undefined', function (done) {
		var obj = { defined: 'bloup'
              , theUndefined: undefined
		          }
	    , collection = db.collection('test');
      ;

	  collection.insert(obj, function (err, docs) {
      var res = serialization.deserializeFromGUI(serialization.serializeForGUI(docs[0]));

      assert.isUndefined(res.theUndefined);
      res.defined.should.equal('bloup');

			done();
		});
	});

  it('null', function (done) {
    var obj = { notNull: 'notNull'
              , theNull: null
              }
      , collection = db.collection('test');
      ;

    collection.insert(obj, function (err, docs) {
      var res = serialization.deserializeFromGUI(serialization.serializeForGUI(docs[0]));

      assert.isNull(res.theNull);
      res.notNull.should.equal('notNull');

      done();
    });
  });


	it('DBRef', function (done) {
		var obj = { dbrefKey: new DBRef('another', '123456789009876543211234')
              , anotherDBR: new DBRef('anothernother', '111111111111111111111111', 'thedb')
		          }
	    , collection = db.collection('test');
      ;

	  collection.insert(obj, function (err, docs) {
      var res = serialization.deserializeFromGUI(serialization.serializeForGUI(docs[0]));

      res.dbrefKey._bsontype.should.equal('DBRef');
      res.dbrefKey.namespace.should.equal('another');
      res.dbrefKey.oid.should.equal('123456789009876543211234');
		  assert.isUndefined(res.dbrefKey.db);

      res.anotherDBR._bsontype.should.equal('DBRef');
      res.anotherDBR.namespace.should.equal('anothernother');
      res.anotherDBR.oid.should.equal('111111111111111111111111');
      res.anotherDBR.db.should.equal('thedb');

			done();
		});
	});


});


describe('Strings should be correctly escaped', function () {

	before(function (done) {
		db.open(function (err) {
			if (err) { return done(err); }

			// Start with a clean DB
			db.dropDatabase(done);
		});
	});

	after(function (done) {
		db.close(done);
	});

	it('Object keys', function (done) {
		var obj = { good: 'bloup'
		          }
	    , collection = db.collection('test');
      ;

    obj['such/a/shit"ty/key'] = 'another bloup';
    obj['34a12'] = 'another blip';

    collection.insert(obj, function (err, docs) {
      var res = serialization.deserializeFromGUI(serialization.serializeForGUI(docs[0]));

      res.good.should.equal('bloup');
      res['such/a/shit"ty/key'].should.equal('another bloup');
      res['34a12'].should.equal('another blip');

			done();
		});
	});

	it('Strings', function (done) {
		var obj = { good: 'bloup'
              , bad: 'Hello\r\nHow are you?\r\nPeace'
		          }
	    , collection = db.collection('test');
      ;


    collection.insert(obj, function (err, docs) {
      var res = serialization.deserializeFromGUI(serialization.serializeForGUI(docs[0]));

      res.good.should.equal('bloup');
      res.bad.should.equal('Hello\r\nHow are you?\r\nPeace');

			done();
		});
	});

  it('Special characters such as backslashes and the string delimiter (double quote)', function (done) {
		var obj = { good: 'bloup'
              , bad: 'A backslash \\ and a double quote "'
		          }
	    , collection = db.collection('test');
      ;


    collection.insert(obj, function (err, docs) {
      var res = serialization.deserializeFromGUI(serialization.serializeForGUI(docs[0]));

      res.good.should.equal('bloup');
      res.bad.should.equal('A backslash \\ and a double quote "');

			done();
		});
  });


});


