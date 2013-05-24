var should = require('chai').should()
  , assert = require('chai').assert
	, serialization = require('../lib/serialization')
  , ObjectID = require('mongodb').ObjectID
  , helpers = require('../lib/helpers')
  , db = require('../lib/db')
  ;

describe('Helpers', function () {

  describe('#areIdsEqual', function () {

    it('ObjectIDs are not equal to their string or number representation', function () {
      var t = new ObjectID("111111111111111111111111")
        , s = "111111111111111111111111"
        , n = 111111111111111111111111;

      t.toString().should.equal(s);
      helpers.areIdsEqual(t, s).should.equal(false);
      helpers.areIdsEqual(s, t).should.equal(false);

      helpers.areIdsEqual(t, n).should.equal(false);
      helpers.areIdsEqual(n, t).should.equal(false);
    });

    it('Numbers are not equal to their string representation', function () {
      helpers.areIdsEqual("121", 121).should.equal(false);
      helpers.areIdsEqual(121, "121").should.equal(false);
    });

    it('Works as expected when comparing things of the same type', function () {
      helpers.areIdsEqual(121, 120).should.equal(false);
      helpers.areIdsEqual(121, 121).should.equal(true);

      helpers.areIdsEqual("bloup", "blop").should.equal(false);
      helpers.areIdsEqual("bloup", "bloup").should.equal(true);

      helpers.areIdsEqual(new ObjectID("111111111111111111111112"), new ObjectID("111111111111111111111111")).should.equal(false);
      helpers.areIdsEqual(new ObjectID("111111111111111111111111"), new ObjectID("111111111111111111111111")).should.equal(true);
    });

  });


  describe('#getIdFromStringId', function () {
    var collection;

    before(function (done) {
      db.open(function (err) {
        if (err) { return done(err); }

        db.dropDatabase(function () {
          collection = db.collection('test');

          collection.insert({ a: 1, _id: new ObjectID("111111111111111111111111") }, function () {
            collection.insert({ a: 2, _id: "bloup" }, function () {
              collection.insert({ a: 3, _id: 42}, function () {
                collection.insert({ a: 4, _id: 12.345}, function () {
                  done();
                });
              });
            });
          });
        });
      });
    });

    after(function (done) {
      db.close(done);
    });

    it('Can retrieve ObjectID _ids', function(done) {
      helpers.getIdFromStringId('test', '111111111111111111111111', function (err, id) {
        assert.isNull(err);
        id.constructor.name.should.equal('ObjectID');
        id.toString().should.equal('111111111111111111111111');

        collection.findOne({ _id: id }, function (err, doc) {
          doc.a.should.equal(1);

          done();
        });
      });
    });

    it('Can retrieve string _ids', function(done) {
      helpers.getIdFromStringId('test', 'bloup', function (err, id) {
        assert.isNull(err);
        id.should.equal('bloup');

        collection.findOne({ _id: id }, function (err, doc) {
          doc.a.should.equal(2);

          done();
        });
      });
    });

    it('Can retrieve integer _id', function(done) {
      helpers.getIdFromStringId('test', '42', function (err, id) {
        assert.isNull(err);
        id.should.equal(42);

        collection.findOne({ _id: id }, function (err, doc) {
          doc.a.should.equal(3);

          done();
        });
      });
    });

    it('Can retrieve floating point number _id', function(done) {
      helpers.getIdFromStringId('test', '12.345', function (err, id) {
        assert.isNull(err);
        id.should.equal(12.345);

        collection.findOne({ _id: id }, function (err, doc) {
          doc.a.should.equal(4);

          done();
        });
      });
    });

    it('Returns an error if no match is found', function (done) {
      helpers.getIdFromStringId('test', 'nope', function (err) {
        assert.isDefined(err);

        done();
      });
    });

  });

});
