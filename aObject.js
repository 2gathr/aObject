function AObject(object) {
	this.object = object;
}

AObject.prototype.each = function(iterator, next) {
	AObject.each(this.object, iterator, next);
};

AObject.prototype.eachSync = function(iterator) {
	AObject.eachSync(this.object, iterator);
};

AObject.prototype.update = function(newObject) {
	AObject.update(this.object, newObject);
};

AObject.prototype.compareKeys = function(object) {
	AObject.compareKeys(this.object, object);
};

AObject.prototype.getKeys = function(keys) {
	AObject.get(this.object, keys);
};

AObject.each = function(object, iterator, next) {
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

AObject.eachSync = function(object, iterator) {
	Object.keys(object).forEach(function(key) {
		iterator(key, object[key]);
	});
};

AObject.update = function(currentObject, newObject) {
	Object.keys(newObject).forEach(function(key) {
		if(typeof newObject[key] == 'object') {
			if(typeof currentObject[key] == 'undefined') currentObject[key] = {};
			return AObject.update(currentObject[key], newObject[key]);
		}
		currentObject[key] = newObject[key];
	});
};

AObject.compareKeys = function(object, expectedObject, strict) {
	var equal = true;
	if(Array.isArray(expectedObject)) {
		expectedObject.forEach(function(key) {
			if(typeof object[key] == 'undefined') equal = false;
		});
	} else {
		Object.keys(expectedObject).forEach(function(key) {
			if(typeof expectedObject[key] == 'object') {
				if(typeof object[key] == 'object') {
					if(!AObject.compareKeys(expectedObject[key], object[key])) equal = false;
				} else equal = false;
			} else if(typeof object[key] == 'undefined') equal = false;
		});
	}
	if(strict) {
		if(!AObject.compareKeys(expectedObject, object)) equal = false;
	}
	return equal;
};

AObject.getKeys = function(object, keys) {
	returnObject = {};
	keys.forEach(function(value) {
		returnObject[value] = object[value];
	});
	return returnObject;
};

module.exports = AObject;
