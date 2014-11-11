# aObject
An Node.js module for iterating through objects asynchronously and synchronously, updating them recursivley and comparing their keys.

**License** [GNU GPL v3.0](https://github.com/2gathr/aObject/blob/master/LICENSE)

## Functions
### aObject.each()
```node
aObject.each(object object, function iterator, function callback);
```
Applies the function `iterator` to each item in `object`, in parallel. `iterator` is called with a key and a value from the object, and a callback for when it has finished. If the iterator passes an error to its callback, the main callback (for the each function) is immediately called with the error.

Note, that since this function applies iterator to each item in parallel, there is no guarantee that the iterator functions will complete in order.

#### Arguments
- object `object` - An object to iterate over.
- function `iterator(string key, mixed value, function callback)` - A function to apply to each item in `object`. `iterator` is passed a `callback(error)` which must be called once it has completed. If no error has occurred, the callback should be run without arguments or with an explicit null argument.
- function `callback(error)` - A callback which is called when all iterator functions have finished, or an error occurs.

#### Example
```node
aObject.each(
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

### aObject.eachSync()
```node
aObject.eachSync(object object, function iterator);
```
Applies the function `iterator` to each item in `object`, serial. `iterator` is called with a key and a value from the object.

#### Arguments
- object `object` - An object to iterate over.
- function `iterator(string key, mixed value)` - A function to apply to each item in `object`.

#### Example
```node
aObject.eachSync(
	{
		key1: 'foo',
		key2: 'bla'
	},
	function(key, value) {
		console.log('The value of ' + key + ' is ' + value);
	}
);
```

### aObject.update()
```node
aObject.update(object currentObject, object newObject);
```
Adds all keys of `newObject` and their values recursively to currentObject or overwrites existing ones.

#### Arguments
- object `currentObject` - The object to be updated.
- object `newObject` - The object to be merged into `currentObject`.

#### Example
```node
aObject.update(
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

### aObject.compareKeys()
```node
aObject.compareKeys(object object, object expectedObject);
```
'Compares all keys of `object` with the keys of `expectedObject` recursively. If the keys of both objects match exactly `true` will be returned, otherwise `false`.

#### Arguments
- object `object` - The first object for comparison.
- object `expectedObject` - The second object for comparison.

#### Example
```node
// returns true
aObject.compareKeys(
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
aObject.compareKeys(
	{
		key1: 'foo',
		key2: 'bla'
	},
	{
		key1: 'foo2',
		key2: {
			key3: 'bla2'
		}
	}
);
```
