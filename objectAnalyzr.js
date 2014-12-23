function ObjectAnalyzr(object) {
	this.object = object;
}

ObjectAnalyzr.prototype.each = function(iterator, next) {
	ObjectAnalyzr.each(this.object, iterator, next);
};

ObjectAnalyzr.prototype.eachSync = function(iterator) {
	ObjectAnalyzr.eachSync(this.object, iterator);
};

ObjectAnalyzr.prototype.update = function(newObject) {
	ObjectAnalyzr.update(this.object, newObject);
};

ObjectAnalyzr.prototype.compare = function(object) {
	ObjectAnalyzr.compareKeys(this.object, object);
};

ObjectAnalyzr.prototype.get = function(keys) {
	ObjectAnalyzr.get(this.object, keys);
};

ObjectAnalyzr.each = function(object, iterator, next) {
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

ObjectAnalyzr.eachSync = function(object, iterator) {
	Object.keys(object).forEach(function(key) {
		iterator(key, object[key]);
	});
};

ObjectAnalyzr.update = function(currentObject, newObject) {
	Object.keys(newObject).forEach(function(key) {
		if(typeof newObject[key] == 'object') {
			if(typeof currentObject[key] == 'undefined') currentObject[key] = {};
			return ObjectAnalyzr.update(currentObject[key], newObject[key]);
		}
		currentObject[key] = newObject[key];
	});
};

ObjectAnalyzr.compareKeys = function(object, expectedObject, strict) {
	var equal = true;
	if(Array.isArray(expectedObject)) {
		expectedObject.forEach(function(key) {
			if(typeof object[key] == 'undefined') equal = false;
		});
	} else {
		Object.keys(expectedObject).forEach(function(key) {
			if(typeof expectedObject[key] == 'object') {
				if(typeof object[key] == 'object') {
					if(!ObjectAnalyzr.compareKeys(expectedObject[key], object[key])) equal = false;
				} else equal = false;
			} else if(typeof object[key] == 'undefined') equal = false;
		});
	}
	if(strict) {
		if(!ObjectAnalyzr.compareKeys(expectedObject, object)) equal = false;
	}
	return equal;
};

ObjectAnalyzr.get = function(object, keys) {
	returnObject = {};
	keys.forEach(function(value) {
		returnObject[value] = object[value];
	});
	return returnObject;
};

module.exports = ObjectAnalyzr;
