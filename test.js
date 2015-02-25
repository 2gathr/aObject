(function() {
	'use strict';

	var assert = require('assert');
	var objectAnalyzr = require('./objectAnalyzr');

	// depth 0
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

	// depth 1
	object = {
		one: 'foo',
		nested: {
			two: 'bar',
			three: 'qux'
		}
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

	// infinite recursion
	object = {
		one: 'foo',
		nested: {
			two: 'bar',
			three: 'qux'
		}
	};
	objectAnalyzr.update(object, extendingObject);
	assert.deepEqual(object, {
	  one: 'foo',
	  nested: {
	    two: 'bar',
	    three: 'corge',
	    four: 'waldo'
	  },
	  five: 'fred'
	});

}());
