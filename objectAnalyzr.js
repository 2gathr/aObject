objectAnalyzr = {};

objectAnalyzr.each = function(object, iterator, next) {
	var length = Object.keys(object).length,
		completed = 0,
		root,
		execute = true;
	if(typeof next == 'undefined') next = function() {};
	if (!length) return next();
	for(var key in object) iterator(key, object[key], onlyOnce(done));
	function onlyOnce(fn) {
        var called = false;
        return function() {
            if (called) throw new Error('callback was already called');
            called = true;
            fn.apply(root, arguments);
        };
	}
	function done(error) {
		if(error) {
			next(error);
			next = function() {};
			return;
		}
		completed++;
		if(completed >= length) next();
	}
};

objectAnalyzr.eachSync = function(object, iterator) {
	Object.keys(object).forEach(function(key) {
		iterator(key, object[key]);
	});
};

objectAnalyzr.update = function(currentObject, newObject, depth) {
	Object.keys(newObject).forEach(function(key) {
		if(typeof newObject[key] == 'object' && depth > 0) {
			if(typeof currentObject[key] == 'undefined') currentObject[key] = {};
			return objectAnalyzr.update(currentObject[key], newObject[key], depth ? depth - 1 : null);
		}
		currentObject[key] = newObject[key];
	});
};

objectAnalyzr.compareKeys = function(object, expectedObject, strict) {
	var equal = true;
	if(Array.isArray(expectedObject)) {
		expectedObject.forEach(function(key) {
			if(typeof object[key] == 'undefined') equal = false;
		});
	} else {
		Object.keys(expectedObject).forEach(function(key) {
			if(typeof expectedObject[key] == 'object') {
				if(typeof object[key] == 'object') {
					if(!objectAnalyzr.compareKeys(expectedObject[key], object[key])) equal = false;
				} else equal = false;
			} else if(typeof object[key] == 'undefined') equal = false;
		});
	}
	if(strict && !objectAnalyzr.compareKeys(expectedObject, object)) equal = false;
	return equal;
};

objectAnalyzr.compare = function(object, expectedObject, strict) {
	var equal = true;
	if(Array.isArray(expectedObject)) {
		if(!Array.isArray(object) || expectedObject.length != object.length) return (equal = false);
		Object.keys(expectedObject).forEach(function(key) {
			if(typeof expectedObject[key] == 'object') {
				if(!objectAnalyzr.compare(object[key], expectedObject[key])) equal = false;
			} else if(expectedObject[key] !== object[key]) equal = false;
		});
	} else {
		if(typeof object != 'object') return (equal = false);
		Object.keys(expectedObject).forEach(function(key) {
			if(typeof object[key] == 'object') {
				if(!objectAnalyzr.compare(object[key], expectedObject[key])) equal = false;
			} else if(expectedObject[key] !== object[key]) equal = false;
		});
	}
	if(strict && !objectAnalyzr.compare(expectedObject, object)) equal = false;
	return equal;
};

objectAnalyzr.get = function(object, keys) {
	var returnObject = {};
	if(Array.isArray(keys)) {
		keys.forEach(function(value) {
			returnObject[value] = object[value];
		});
	} else {
		Object.keys(keys).forEach(function(key) {
			returnObject[keys[key]] = object[key];
		});
	}
	return returnObject;
};

objectAnalyzr.getValues = function(object, keys) {
	var returnArray = {};
	if(typeof keys == 'undefined') keys = Object.keys(keys);
	keys.forEach(function(key) {
		returnArray.push(object[key]);
	});
	return returnArray;
};

module.exports = objectAnalyzr;
