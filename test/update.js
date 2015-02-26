(function() {
  'use strict';

  var assert = require('assert');
  var objectAnalyzr = require('../objectAnalyzr');

  describe('objectAnalyzr', function() {
    describe('.update()', function() {

      it('should replace objects on level 1 when depth=0', function() {
        var object = {
          one: 'foo',
          nested: {
            two: 'bar',
            three: 'qux'
          }
        };
        var extendingObject = {
          nested: {
            three: 'corge',
            four: 'waldo'
          },
          five: 'fred'
        };
        objectAnalyzr.update(object, extendingObject, { depth: 0 });
        assert.deepEqual(object, {
          one: 'foo',
          nested: {
            three: 'corge',
            four: 'waldo'
          },
          five: 'fred'
        });
      });

      it('should update objects on level 1 when depth=1', function() {
        var object = {
          one: 'foo',
          nested: {
            two: 'bar',
            three: 'qux'
          }
        };
        var extendingObject = {
          nested: {
            three: 'corge',
            four: 'waldo'
          },
          five: 'fred'
        };
        objectAnalyzr.update(object, extendingObject, { depth: 1 });
        assert.deepEqual(object, {
          one: 'foo',
          nested: {
            two: 'bar',
            three: 'corge',
            four: 'waldo'
          },
          five: 'fred'
        });
      });

      it('should upate objects on any level when no depth option is given', function() {
        var object = {
          one: 'foo',
          nested: {
            two: 'bar',
            three: 'qux',
            evenDeeper: {
              this: 'isAwesome',
              and: 'easyToUse'
            }
          }
        };
        var extendingObject = {
          nested: {
            three: 'corge',
            four: 'waldo',
            evenDeeper: {
              this: 'isEvenGreater'
            }
          },
          five: 'fred'
        };
        objectAnalyzr.update(object, extendingObject);
        assert.deepEqual(object, {
          one: 'foo',
          nested: {
            two: 'bar',
            three: 'corge',
            four: 'waldo',
            evenDeeper: {
              this: 'isEvenGreater',
              and: 'easyToUse'
            }
          },
          five: 'fred'
        });
      });

    });
  });

}());
