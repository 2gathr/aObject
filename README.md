# objectAnalyzr
A Node.js module for iterating through objects asynchronously and synchronously, updating them recursivley and comparing their keys.

**License** [GNU GPL v3.0](https://github.com/2gathr/objectAnalyzr/blob/master/LICENSE)

## Usage
```sh
npm install object-analyzr --save
```
```node
var objectAnalyzr = require('object-analyzr');
```

## Functions
### objectAnalyzr.each()
```node
objectAnalyzr.each(object object, function iterator, function callback);
```
Applies the function `iterator` to each item in `object`, in parallel. `iterator` is called with a key and a value from the object, and a callback for when it has finished. If the iterator passes an error to its callback, the main callback (for the each function) is immediately called with the error.

Note, that since this function applies iterator to each item in parallel, there is no guarantee that the iterator functions will complete in order.

#### Arguments
- object `object` - An object to iterate over.
- function `iterator(string key, mixed value, function callback)` - A function to apply to each item in `object`. `iterator` is passed a `callback(error)` which must be called once it has completed. If no error has occurred, the callback should be run without arguments or with an explicit null argument.
- function `callback(error)` - A callback which is called when all iterator functions have finished, or an error occurs.

#### Example
```node
// will log 'done' to console if no error occurs in the iterator function
objectAnalyzr.each(
	{
		one: 'foo',
		two: 'bar',
	},
	function(key, val, next) {
		// Do some asynchronous stuff with key and value
		if(err) next(err); // Ooops ... error ...
		next();
	},
	function(err) {
		if(err) throw error;
		console.log('done');
	}
);
```

### objectAnalyzr.eachSync()
```node
objectAnalyzr.eachSync(object object, function iterator);
```
Applies the function `iterator` to each item in `object`, serial. `iterator` is called with a key and a value from the object.

#### Arguments
- object `object` - An object to iterate over.
- function `iterator(string key, mixed value)` - A function to apply to each item in `object`.

#### Example
```node
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
```node
objectAnalyzr.update(object currentObject, object newObject[, number depth]);
```
Adds all keys of `newObject` and their values recursively to currentObject and overwrites existing ones.

#### Arguments
- object `currentObject` - The object to be updated.
- object `newObject` - The object to be merged into `currentObject`.
- number `depth` - The depth of recursive updating. All further nesting will be ignored and the concerning part of `currentObject` will be the same as the conerning one of `newObject`. `null` for infinite recursion. Default: `null`.

#### Example
```node
// currentObject will be {one: 'foo', two: 'qux', three: 'corge'}
objectAnalyzr.update(
	{
		one: 'foo',
		two: 'bar',
	},
	{
		two: 'qux',
		three: 'corge'
	}
);
// currentObject will be {one: 'foo', two: {twoThree: 'corge', twoFour: 'waldo'}, three: 'fred'}
objectAnalyzr.update(
	{
		one: 'foo',
		two: {
			twoOne: 'bar',
			twoTwo: 'qux'
		}
	},
	{
		two: {
			twoThree: 'corge',
			twoFour: 'waldo'
		},
		three: 'fred'
	}
)
```

### objectAnalyzr.compareKeys()
```node
objectAnalyzr.compareKeys(mixed expectedObject, object object[, bool strict]);
```
Compares all keys of `object` with the keys of `expectedObject` recursively. If the keys of both objects match exactly `true` will be returned, otherwise `false`.

#### Arguments
- object `object` - The object to be compared with `expectedObject`.
- mixed `expectedObject` - The object for comparison. It can be an array as well, where only the keys are given, if `expectedObject` is an array, the comparison isn't recursive.
- bool `strict` - Wether all keys of `object` have to exist in `expectedObject` as well or not. Default: `false`.

Note, that by default all keys of `expectedObject` have to exist in `object` as well to return `true`, but in `object` there can be keys not given in `expectedObject`.

If `strict` is set to true, all keys of `object` have to exist in `expectedObject` as well, so the comparison is bidirectional.

#### Example
```node
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
```node
objectAnalyzr.compare(mixed object, mixed expectedObject[, bool strict]);
```
Compares recursively if all elements of `expectedObject` exist in `object` as well and have the same content. If `strict` is true, the comparison will be bidirectional.

#### Arguments
- mixed `object` - The array or object to compare with.
- mixed `expectedObject` - The array or object for comparison.
- bool `strict` - Wether all values of `object` have to exist in `expectedObject` as well. Default: `false`.

#### Example
```node
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
```node
objectAnalyzr.get(object object, mixed keys);
```
Returns `object` reduced to the keys in `keys`.

#### Arguments
- object `object` - The object the wanted values are in.
- mixed `keys` - An array or object with all keys to be preserved. If it's an object, only the keys that are present in `keys` are preserved, plus they are renamed to the corresponding value in `keys`.

#### Example
```node
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
```node
objectAnalyzr.getValues(object object[, array keys]);
```
Return part of or all values of `object`.

#### Arguments
- object `object` - The object with the wanted values.
- array `keys` - All keys of `object` you want the values of. If this argument is undefined, all values of `object` are returned.

#### Example
```node
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
