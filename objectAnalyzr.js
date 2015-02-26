module.exports = exports = (function() {
  'use strict';

  var objectAnalyzr = {};

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
      ++completed;
      if(completed >= length) next();
    }
  };

  objectAnalyzr.eachSync = function(object, iterator) {
    Object.keys(object).forEach(function(key) {
      iterator(key, object[key]);
    });
  };

  objectAnalyzr.update = function(object, extendingObject, options) {
    var defaultOptions = {
      depth: null
    };
    if(typeof options == 'undefined') options = defaultOptions;
    else if(typeof options != 'object' || options === null) options = {depth: options};
    objectAnalyzr.update(defaultOptions, options);
    options = defaultOptions;
    if(typeof object != 'object') object = {}; // if object was set to extendingObject, modifying object would also modify extendingObject
    Object.keys(extendingObject).forEach(function(key) {
      if(typeof extendingObject[key] == 'object' && (options.depth === null || options.depth > 0)) {
        if(typeof object[key] == 'undefined') object[key] = {};
        return objectAnalyzr.update(object[key], extendingObject[key], options.depth ? options.depth - 1 : null);
      }
      object[key] = extendingObject[key];
    });
  };

  objectAnalyzr.compareKeys = function(object, expectedObject, options) {
    var defaultOptions = {
      bidirectional: false
    };
    if(typeof options == 'undefined') options = defaultOptions;
    else if(typeof options != 'object') options = {bidirectional: options};
    objectAnalyzr.update(defaultOptions, options);
    options = defaultOptions;
    if(options.bidirectional) {
      objectAnalyzr.update(options, {bidirectional: false});
      if(!objectAnalyzr.compareKeys(expectedObject, object, options)) return false;
    }
    if(Array.isArray(expectedObject)) {
      expectedObject.forEach(function(key) {
        if(typeof object[key] == 'undefined') return false;
      });
    } else {
      Object.keys(expectedObject).forEach(function(key) {
        if(typeof expectedObject[key] == 'object') {
          if(typeof object[key] == 'object') {
            if(!objectAnalyzr.compareKeys(expectedObject[key], object[key], options)) return false;
          } else return false;
        } else if(typeof object[key] == 'undefined') return false;
      });
    }
    return true;
  };

  objectAnalyzr.compare = function(object, expectedObject, options) {
    var defaultOptions = {
      bidirectional: false,
      strict: false
    };
    if(typeof options == 'undefined') options = defaultOptions;
    else if(typeof options != 'object') options = {bidirectional: options};
    objectAnalyzr.update(defaultOptions, options);
    options = defaultOptions;
    if(options.bidirectional) {
      objectAnalyzr.update(options, {bidirectional: false});
      if (!objectAnalyzr.compare(expectedObject, object, options)) return false;
    }
    if(Array.isArray(expectedObject)) {
      if(!Array.isArray(object) || expectedObject.length != object.length) return false;
      Object.keys(expectedObject).forEach(function(key) {
        if(typeof expectedObject[key] == 'object') {
          if(!objectAnalyzr.compare(object[key], expectedObject[key], options)) return false;
        } else if(options.strict && expectedObject[key] !== object[key]) return false;
        else if (expectedObject[key] != object[key]) return false;
      });
    } else {
      if(typeof object != 'object') return false;
      else Object.keys(expectedObject).forEach(function(key) {
        if(typeof object[key] == 'object') {
          if(!objectAnalyzr.compare(object[key], expectedObject[key], options)) return false;
        } else if(options.strict && expectedObject[key] !== object[key]) return false;
        else if(expectedObject[key] != object[key]) return false;
      });
    }
    return true;
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
    var returnArray = [];
    if(typeof keys == 'undefined') keys = Object.keys(object);
    keys.forEach(function(key) {
      returnArray.push(object[key]);
    });
    return returnArray;
  };

  return objectAnalyzr;
}());
