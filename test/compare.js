(function() {
  'use strict';

  var assert = require('assert');
  var objectAnalyzr = require('../objectAnalyzr');

  describe('objectAnalyzr', function() {
    describe('.compare()', function() {

      it('should return true if the expected object has some extra keys and both are nested', function() {
        var object = {
          one: 'foo',
          nested: {
            two: 'bar',
            three: 'qux',
            four: 'waldo',
            evenDeeper: {
              this: 'isAwesome',
              and: 'easyToUse'
            }
          },
          five: 'fred'
        };
        var expectedObject = {
          one: 'foo',
          nested: {
            two: 'bar',
            three: 'qux',
            evenDeeper: {
              this: 'isAwesome'
            }
          }
        };
        assert.equal(true, objectAnalyzr.compare(object, expectedObject));
      });

      it('should return true if the expected object has some extra keys and both aren\'t nested', function() {
        assert.equal(true, objectAnalyzr.compare(
          {
            one: 'foo',
            two: [
              'bar',
              'qux'
            ],
            three: 'corge'
          },
          {
            one: 'foo',
            two: [
              'bar',
              'qux'
            ]
          }
        ));
      });

      it('should return false if the expected object has the same extra keys with different content', function() {
        assert.equal(false, objectAnalyzr.compare(
          {
            one: 'foo',
            two: [
              'bar',
              'qux'
            ]
          },
          {
            one: 'foo',
            two: [
              'bar',
              'corge'
            ]
          }
        ));
      });

      it('should return false if a key of the expected object has a different name', function() {
        assert.equal(false, objectAnalyzr.compare(
          {
            one: 'foo',
            two: [
              'bar',
              'qux'
            ]
          },
          {
            one: 'foo',
            three: [
              'bar',
              'qux'
            ]
          }
        ));
      });

    });
  });
})();
