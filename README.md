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
		key1: 'foo',
		key2: 'bla',
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
// will log 2 messages to console: 'The value of key1 is foo'; 'The value of key2 is bla'
objectAnalyzr.eachSync(
	{
		key1: 'foo',
		key2: 'bla'
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
// currentObject will be {key1: 'foo', key2: 'bla2', key3: 'foo2'}
objectAnalyzr.update(
	{
		key1: 'foo',
		key2: 'bla',
	},
	{
		key2: 'bla2',
		key3: 'foo2'
	}
);
// currentObject will be {key1: 'foo2', key2: {key3: 'bla1', key5: 'bla3'}, key3: 'foo2'}
objectAnalyzr.update(
	{
		key1: 'foo',
		key2: {
			key3: 'bla1',
			key4: 'bla2'
		}
	},
	{
		key2: {
			key3: 'bla1',
			key5: 'bla3'
		},
		key3: 'foo2'
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
		key1: 'foo',
		key2: {
			key3: 'bla'
		}
	},
	{
		key1: 'foo2',
		key2: {
			key3: 'bla2'
		}
	}
);
// returns false
objectAnalyzr.compareKeys(
	[
		'key1',
		'key3'
	],
	{
		key1: 'foo',
		key2: 'bla'
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
- bool `strict` - Wether all values of `object` have to exist in `expectedObject` as well. Default: `true`.

#### Example
```node
// returns true
objectAnalyzr.compare(
	{
		1: '2',
		3: [
			7,
			9
		],
		4: '5'
	},
	{
		1: '2',
		3: [
			7,
			9
		]
	}
);
// returns false
objectAnalyzr.compare(
	{
		1: '2',
		3: [
			4,
			5
		]
	},
	{
		1: '2',
		3: [
			4,
			7
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
// returns {first: 'one', third: 'four'}
objectAnalyzr.get(
	{
		first: 'one',
		second: 'seven',
		third: 'four'
	},
	[
		'first',
		'third'
	]
);
// returns {fifth: 'one', second: 'four'}
objectAnalyzr.get(
	{
		first: 'one',
		second: 'seven',
		third: 'four'
	},
	{
		first: 'fifth',
		third: 'second'
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
// returns ['bar3', 'bar4']
objectAnalyzr.getValues(
	{
		foo: 'bar3',
		foo2: 'bar4'
	}
);
// returns ['bar4', 'bar6']
objectAnalyzr.getValues(
	{
		foo: 'bar4',
		foo2: 'bar5',
		foo3: 'bar6'
	},
	[
		'foo',
		'foo3'
	]
);
```
