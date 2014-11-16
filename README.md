# AObject
An Node.js module for iterating through objects asynchronously and synchronously, updating them recursivley and comparing their keys.

**License** [GNU GPL v3.0](https://github.com/2gathr/AObject/blob/master/LICENSE)

## Usage
```sh
npm install a-object
```
```node
var AObject = require('a-object');
```

## Functions
### AObject()
```node
var aObject = new AObject(object object);
```
Creates a new instance of `AObject` with the given `object`.

#### Arguments
- object `object` - The object to use for instance functions.

#### Example
```node
var aObject = new AObject({
	key1: 'foo',
	key2: 'bla'
});
```

### AObject#each()
```node
aObject.each(function iterator, function callback);
```
Calls `AObject.each()` with the object given in `AObject()` as `object`.

#### Arguments
- function `iterator(string key, mixed value, function callback)` - A function to apply to each item in `object`. `iterator` is passed a `callback(error)` which must be called once it has completed. If no error has occurred, the callback should be run without arguments or with an explicit null argument.
- function `callback(error)` - A callback which is called when all iterator functions have finished, or an error occurs.

### AObject#eachSync()
```node
aObject.eachSync(function iterator);
```
Calls `AObject.eachSync()` with the object given in `AObject()` as `object`.

#### Arguments
- function `iterator(string key, mixed value)` - A function to apply to each item in `object`.

### AObject#update()
```node
aObject.update(object newObject);
```
Calls `AObject.update()` with the object given in `AObject()` as `newObject`.

#### Arguments
- object `newObject` - The object to be merged into `currentObject`.

### AObject#compareKeys()
```node
aObject.compareKeys(object object);
```
Calls `AObject.compareKeys()` with the object given in `AObject()` as `expectedObject`.

#### Arguments
- object `object` - The object to be compared with `expectedObject`.

### AObject.each()
```node
AObject.each(object object, function iterator, function callback);
```
Applies the function `iterator` to each item in `object`, in parallel. `iterator` is called with a key and a value from the object, and a callback for when it has finished. If the iterator passes an error to its callback, the main callback (for the each function) is immediately called with the error.

Note, that since this function applies iterator to each item in parallel, there is no guarantee that the iterator functions will complete in order.

#### Arguments
- object `object` - An object to iterate over.
- function `iterator(string key, mixed value, function callback)` - A function to apply to each item in `object`. `iterator` is passed a `callback(error)` which must be called once it has completed. If no error has occurred, the callback should be run without arguments or with an explicit null argument.
- function `callback(error)` - A callback which is called when all iterator functions have finished, or an error occurs.

#### Example
```node
AObject.each(
	{
		key1: 'foo',
		key2: 'bla',
	},
	function(key, value, next) {
		// Do some asynchronous stuff with key and value
		next();
	},
	function(error) {
		if(error) {
			throw error;
		}
		console.log('done');
	}
);
```

### AObject.eachSync()
```node
AObject.eachSync(object object, function iterator);
```
Applies the function `iterator` to each item in `object`, serial. `iterator` is called with a key and a value from the object.

#### Arguments
- object `object` - An object to iterate over.
- function `iterator(string key, mixed value)` - A function to apply to each item in `object`.

#### Example
```node
AObject.eachSync(
	{
		key1: 'foo',
		key2: 'bla'
	},
	function(key, value) {
		console.log('The value of ' + key + ' is ' + value);
	}
);
```

### AObject.update()
```node
AObject.update(object currentObject, object newObject);
```
Adds all keys of `newObject` and their values recursively to currentObject or overwrites existing ones.

#### Arguments
- object `currentObject` - The object to be updated.
- object `newObject` - The object to be merged into `currentObject`.

#### Example
```node
AObject.update(
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

### AObject.compareKeys()
```node
AObject.compareKeys(mixed expectedObject, object object);
```
'Compares all keys of `object` with the keys of `expectedObject` recursively. If the keys of both objects match exactly `true` will be returned, otherwise `false`.

#### Arguments
- mixed `expectedObject` - The object for comparison. It can be an array as well, where only the keys are given, if `èxpectedObject` is an array, the comparison isn't recursive.
- object `object` - The object to be compared with `expectedObject`.

Note, that all keys of `expectedObject` have to exist in `object` as well to return true, but in `object` there can be keys not given in `epxpectedObject`.

#### Example
```node
// returns true
AObject.compareKeys(
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
AObject.compareKeys(
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
