# objectAnalyzr
A Node.js module for iterating through objects asynchronously and synchronously, updating them recursivley and comparing their keys.

**License** [GNU GPL v3.0](https://github.com/2gathr/objectAnalyzr/blob/master/LICENSE)

## Usage
```sh
npm install object-analyzr --save
```
```js
var objectAnalyzr = require('object-analyzr');
```

## Functions
### objectAnalyzr.each()
```js
objectAnalyzr.each(object object, function iterator, function callback);
```
Applies the function `iterator` to each item in `object`, in parallel. `iterator` is called with a key and a value from the object, and a callback for when it has finished. If the iterator passes an error to its callback, the main callback (for the each function) is immediately called with the error.

Note, that since this function applies iterator to each item in parallel, there is no guarantee that the iterator functions will complete in order.

#### Arguments
- object `object` - An object to iterate over.
- function `iterator(string key, mixed value, function callback)` - A function to apply to each item in `object`. `iterator` is passed a `callback(error)` which must be called once it has completed. If no error has occurred, the callback should be run without arguments or with an explicit null argument.
- function `callback(error)` - A callback which is called when all iterator functions have finished, or an error occurs.

#### Example
```js
// will log 'done' to console if no error occurs in the iterator function
objectAnalyzr.each(
  {
    one: 'foo',
    two: 'bar',
  },
  function(key, val, next) {
    // Do some asynchronous stuff with key and value
    if(err) return next(err); // Ooops ... error ...
    next();
  },
  function(err) {
    if(err) throw error;
    console.log('done');
  }
);
```

### objectAnalyzr.eachSync()
```js
objectAnalyzr.eachSync(object object, function iterator);
```
Applies the function `iterator` to each item in `object`, serial. `iterator` is called with a key and a value from the object.

#### Arguments
- object `object` - An object to iterate over.
- function `iterator(string key, mixed value)` - A function to apply to each item in `object`.

#### Example
```js
// will log 2 messages to console: 'The value of one is foo'; 'The value of two is bar'
objectAnalyzr.eachSync(
  {
    one: 'foo',
    two: 'bar'
  },
  function(key, value) {
    console.log('The value of ' + key + ' is ' + value);
  }
);
```

### objectAnalyzr.update()
```js
objectAnalyzr.update(object object, object extendingObject[, mixed options]);
```
Adds all keys of `extendingObject` and their values recursively to `object` and overwrites existing ones.

Note that `object` is manipulated directly (objects are passed by reference in JavaScript) and not cloned first, so there is no return.

#### Arguments
- object `currentObject` - The object to be updated.
- object `newObject` - The object to be merged into `object`.
- mixed `options` - Object with the wanted setup or the `depth` option as a number. Possible options are listed below:
  - number `depth` - The depth of recursive updating. All further nesting will be ignored and the concerning part of `object` will be replaced by the one in `extendingObject`. `null` for infinite recursion. Defaults to `null`.

#### Example
```js
var object = {
  one: 'foo',
  two: 'bar',
};
objectAnalyzr.update(object, {
    two: 'qux',
    three: 'corge'
  }
);
console.log(object); // { one: 'foo', two: 'qux', three: 'corge' }

object = {
  one: 'foo',
  nested: {
    two: 'bar',
    three: 'qux'
  }
};
objectAnalyzr.update(object, {
    nested: {
      three: 'corge',
      four: 'waldo'
    },
    five: 'fred'
  }, { depth: 0 }
);
console.log(object);  // { one: 'foo', nested: { three: 'corge', four: 'waldo' }, five: 'fred' }
```

### objectAnalyzr.compareKeys()
```js
objectAnalyzr.compareKeys(mixed expectedObject, object object[, bool strict]);
```
Compares all keys of `object` with the keys of `expectedObject` recursively. If the keys of both objects match exactly `true` will be returned, otherwise `false`.

#### Arguments
- object `object` - The object to be compared with `expectedObject`.
- mixed `expectedObject` - The object for comparison. It can be an array as well, where only the keys are given, if `expectedObject` is an array, the comparison isn't recursive.
- mixed `options` - Object with the wanted setup or the `bidirectional` option (which was `strict` in  all versions < v3.2.0). Possible options are listed below:
  - boolean `bidirectional` - Wether all keys of `object` have to exist in `expectedObject` as well or not. Defaults to `false`.

Note that by default, all keys of `expectedObject` have to exist in `object` as well to return `true`, but in `object` there can be keys not set in `expectedObject`.

If `options.bidirectional` is set to true, all keys of `object` have to exist in `expectedObject` as well, so the comparison is bidirectional.

#### Example
```js
// returns true
objectAnalyzr.compareKeys(
  {
    one: 'foo',
    two: {
      twoOne: 'bar'
    }
  },
  {
    one: 'qux',
    two: {
      twoOne: 'corge'
    }
  }
);
// returns false
objectAnalyzr.compareKeys(
  [
    'one',
    'two'
  ],
  {
    one: 'foo',
    three: 'bar'
  }
);
```

### objectAnalyzr.compare()
```js
objectAnalyzr.compare(mixed object, mixed expectedObject[, bool strict]);
```
Compares recursively if all elements of `expectedObject` exist in `object` as well and have the same content. If `strict` is true, the comparison will be bidirectional.

#### Arguments
- mixed `object` - The array or object to compare with.
- mixed `expectedObject` - The array or object for comparison.
- mixed `options` - Object with the wanted setup or the `bidirectional` option (which was `strict` in  all versions < v3.2.0). Possible options are listed below:
  - boolean `bidirectional` - Wether all keys of `object` have to exist in `expectedObject` as well or not. Defaults to `false`.
  - boolean `strict` - Whether the comparison of the values of all properties are made with !== (without type conversion) or with != (with type conversion).

Note that by default, all properties of `expectedObject` have to exist in `object` as well to return `true`, but in `object` there can be properties not set in `expectedObject`.

If `options.bidirectional` is set to true, all keys of `object` have to exist in `expectedObject` as well, so the comparison is bidirectional.

#### Example
```js
// returns true
objectAnalyzr.compare(
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
);
// returns false
objectAnalyzr.compare(
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
);
```

### objectAnalyzr.get()
```js
objectAnalyzr.get(object object, mixed keys);
```
Returns `object` reduced to the keys in `keys`.

#### Arguments
- object `object` - The object the wanted values are in.
- mixed `keys` - An array or object with all keys to be preserved. If it's an object, only the keys that are present in `keys` are preserved, plus they are renamed to the corresponding value in `keys`.

#### Example
```js
// returns {one: 'foo', three: 'qux'}
objectAnalyzr.get(
  {
    one: 'foo',
    two: 'bar',
    three: 'qux'
  },
  [
    'one',
    'three'
  ]
);
// returns {four: 'foo', five: 'qux'}
objectAnalyzr.get(
  {
    one: 'foo',
    two: 'bar',
    three: 'qux'
  },
  {
    one: 'four',
    three: 'five'
  }
)
```

### objectAnalyzr.getValues()
```js
objectAnalyzr.getValues(object object[, array keys]);
```
Return part of or all values of `object`.

#### Arguments
- object `object` - The object with the wanted values.
- array `keys` - All keys of `object` you want the values of. If this argument is undefined, all values of `object` are returned.

#### Example
```js
// returns ['foo', 'bar']
objectAnalyzr.getValues(
  {
    one: 'foo',
    two: 'bar'
  }
);
// returns ['foo', 'qux']
objectAnalyzr.getValues(
  {
    one: 'foo',
    two: 'bar',
    three: 'qux'
  },
  [
    'one',
    'three'
  ]
);
```
