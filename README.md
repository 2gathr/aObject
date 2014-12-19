# ObjectAnalyzr
A Node.js module for iterating through objects asynchronously and synchronously, updating them recursivley and comparing their keys.

**License** [GNU GPL v3.0](https://github.com/2gathr/ObjectAnalyzr/blob/master/LICENSE)

## Usage
```sh
npm install a-object
```
```node
var ObjectAnalyzr = require('a-object');
```

## Functions
### ObjectAnalyzr()
```node
var objectAnalyzr = new ObjectAnalyzr(object object);
```
Creates a new instance of `ObjectAnalyzr` with the given `object`.

#### Arguments
- object `object` - The object to use for instance functions.

#### Example
```node
var objectAnalyzr = new ObjectAnalyzr({
	key1: 'foo',
	key2: 'bla'
});
```

### ObjectAnalyzr#each()
```node
objectAnalyzr.each(function iterator, function callback);
```
Calls `ObjectAnalyzr.each()` with the object given in `ObjectAnalyzr()` as `object`.

#### Arguments
- function `iterator(string key, mixed value, function callback)` - A function to apply to each item in `object`. `iterator` is passed a `callback(error)` which must be called once it has completed. If no error has occurred, the callback should be run without arguments or with an explicit null argument.
- function `callback(error)` - A callback which is called when all iterator functions have finished, or an error occurs.

### ObjectAnalyzr#eachSync()
```node
objectAnalyzr.eachSync(function iterator);
```
Calls `ObjectAnalyzr.eachSync()` with the object given in `ObjectAnalyzr()` as `object`.

#### Arguments
- function `iterator(string key, mixed value)` - A function to apply to each item in `object`.

### ObjectAnalyzr#update()
```node
objectAnalyzr.update(object newObject);
```
Calls `ObjectAnalyzr.update()` with the object given in `ObjectAnalyzr()` as `newObject`.

#### Arguments
- object `newObject` - The object to be merged into `currentObject`.

### ObjectAnalyzr#compare()
```node
objectAnalyzr.compare(mixed expectedObject);
```
Calls `ObjectAnalyzr.compare()` with the object given in `ObjectAnalyzr()` as `object`.

#### Arguments
- mixed `object` - The object for comparision. It can be an array as well, where only the keys are given, if `expectedObject` is an array, the comparison isn't recursive.
- bool `strict` - Wether all keys of `object` have to exist in `expectedObject` as well. Default: `false`

### ObjectAnalyzr#compareKeys() *Deprecated*
Deprecated alias for `ObjectAnalyzr#compare()`. Will be removed in version 2.x.

### ObjectAnalyzr#get()
```node
objectAnalyzr.get(array keys)
```
Calls `ObjectAnalyzr.get()` with the object given in `ObjectAnalyzr()` as `object`.

#### Arguments
- array `keys` - All keys of `object` to be returned.

### ObjectAnalyzr#getKeys() *Deprecated*
Deprecated alias for `ObjectAnalyzr#get()`. Will be removed in version 2.x.

### ObjectAnalyzr.each()
```node
ObjectAnalyzr.each(object object, function iterator, function callback);
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
ObjectAnalyzr.each(
	{
		key1: 'foo',
		key2: 'bla',
	},
	function(key, value, next) {
		// Do some asynchronous stuff with key and value
		if(err) next(err); // Ooops ... error ...
		next();
	},
	function(error) {
		if(error) throw error;
		console.log('done');
	}
);
```

### ObjectAnalyzr.eachSync()
```node
ObjectAnalyzr.eachSync(object object, function iterator);
```
Applies the function `iterator` to each item in `object`, serial. `iterator` is called with a key and a value from the object.

#### Arguments
- object `object` - An object to iterate over.
- function `iterator(string key, mixed value)` - A function to apply to each item in `object`.

#### Example
```node
// will log 2 messages to console: 'The value of key1 is foo'; 'The value of key2 is bla'
ObjectAnalyzr.eachSync(
	{
		key1: 'foo',
		key2: 'bla'
	},
	function(key, value) {
		console.log('The value of ' + key + ' is ' + value);
	}
);
```

### ObjectAnalyzr.update()
```node
ObjectAnalyzr.update(object currentObject, object newObject);
```
Adds all keys of `newObject` and their values recursively to currentObject or overwrites existing ones.

#### Arguments
- object `currentObject` - The object to be updated.
- object `newObject` - The object to be merged into `currentObject`.

#### Example
```node
// currentObject will be {key1: 'foo', key2: 'bla2', key3: 'foo2'}
ObjectAnalyzr.update(
	{
		key1: 'foo',
		key2: 'bla',
	},
	{
		key2: 'bla2',
		key3: 'foo2'
	}
);
```

### ObjectAnalyzr.compare()
```node
ObjectAnalyzr.compare(mixed expectedObject, object object);
```
Compares all keys of `object` with the keys of `expectedObject` recursively. If the keys of both objects match exactly `true` will be returned, otherwise `false`.

#### Arguments
- object `object` - The object to be compared with `expectedObject`.
- mixed `expectedObject` - The object for comparison. It can be an array as well, where only the keys are given, if `expectedObject` is an array, the comparison isn't recursive.
- bool `strict` - Wether all keys of `object` have to exist in `expectedObject` as well or not. Default: false

Note, that by default all keys of `expectedObject` have to exist in `object` as well to return `true`, but in `object` there can be keys not given in `expectedObject`.

If `strict` is set to true, all keys of `object` have to exist in `expectedObject` as well, so the comparison is bidirectional.

#### Example
```node
// returns true
ObjectAnalyzr.compare(
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
ObjectAnalyzr.compare(
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

### ObjectAnalyzr.compareKeys() *Deprecated*
Deprecated alias for `ObjectAnalyzr.compare()`. Will be removed in version 2.x.

### ObjectAnalyzr.get()
```node
ObjectAnalyzr.get(object object, array keys);
```
Returns all keys in `keys` of `object`.

#### Arguments
- object `object` - The object the wanted values are in.
- array `keys` - An array with all keys to be returned.

#### Example
```node
// returns {first: 'one', third: 'four'}
ObjectAnalyzr.get(
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
```

### ObjectAnalyzr.getKeys() *Deprecated*
Deprecated alias for `ObjectAnalyzr.get()`. Will be removed in version 2.x.
