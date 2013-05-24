var should = require('chai').should()
  , assert = require('chai').assert
	, serialization = require('../lib/serialization')
  , ObjectID = require('mongodb').ObjectID
  , helpers = require('../lib/helpers')
  ;

describe.only('#areIdsEqual', function () {

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
