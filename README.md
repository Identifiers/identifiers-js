## JavaScript implementation of [Identifiers spec](https://github.com/Identifiers/spec)

[![Build Status](https://travis-ci.org/Identifiers/identifiers-js.svg?branch=master)](https://travis-ci.org/Identifiers/identifiers-js)
[![Coverage Status](https://coveralls.io/repos/github/Identifiers/identifiers-js/badge.svg?branch=master)](https://coveralls.io/github/Identifiers/identifiers-js?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/identifiers/identifiers-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/identifiers/identifiers-js?targetFile=package.json)

## Installation and Usage
```sh
npm install identifiers-js
```
Identifiers-js is written in TypeScript and generates ES5 JavaScript.
#### TypeScript
```js
import * as IDs from "identifiers";
```
### JavaScript
```js
var IDs = require('identifiers');
```
The IDs reference comes with methods to parse Identifier strings as well as a factory to create Identifier instances.

```js
var integerId = IDs.factory.integer(22);

console.log(integerId.value);

// encode the identifier
var dataString = integerId.toString();
var humanString = integerId.toBase32String();

// decode the identifier
var decodedId = IDs.parse(dataString);
// parse() can decode either type of encoded string
var decodedId2 = IDs.parse(humanString);

console.log(decodedId.value === decodedId2.value);
// -> true
```

### Lists and Map Identifiers
Identifiers-js supports list and map identifiers in the factories. Each type factory has a `.list()` and '.map()` factory method which sets the type of structure.

```js
var listId = IDs.factory.boolean.list(true, true, false);
var mapId = IDs.factory.long.map({a: 335843, b: -997});
```

### JSON Support
Identifiers-js has support for both generating and parsing JSON data values. Identifier instances safely encode themselves into a `JSON.stringify()` process. Additionally, a JSON [`reviver`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) is provided for `JSON.parse()` calls.

```js
var id = IDs.factory.string("Hello, World!");
var anObject = { a: "a message", b: id };
var json = JSON.stringify(anObject);

console.log(json);
// -> { "a": "a message", "b": "Ç/IÒÁIÖêqÉ34uwâêl7Tþ" }

var parsedObject = JSON.parse(json, IDs.JSON_reviver);
var parsedId = parsedObject.b;

console.log(parsedId.value);
// -> "Hello, World!"
```

## Supported Types

#### Primitive identifiers
* string -- utf-8 string
* boolean -- true or false
* integer -- 32-bit signed ints
* float -- 64-bit signed decimals (IEEE 754)
* long -- 64-bit signed ints
* bytes -- array of bytes

#### Structured identifiers
* list -- sequence of same-type identifiers
* map -- dictionary of sorted string-keyed, same-type identifiers

#### Semantic Identifiers
* datetime: unix time. Base type is long
* UUID: Supports encoding all types. [https://en.wikipedia.org/wiki/Universally_unique_identifier]()
* geo: Decimal latitude and longitude. [https://en.wikipedia.org/wiki/Geotagging]()

# API Reference


### Create Identifiers with Factory Methods
The factory has methods for each type of identifier. These methods can consume various inputs to build an identifier.

Each identifier type's factory has methods to construct structural identifiers of their type. Each structural factory method accepts the same inputs as the single value methods, but in structural form.
#### String
```js
IDs.factory.string('Hello');
// list factory functions can accept a vararg of values
IDs.factory.string.list('Hello', 'friend', 'welcome!');
// list factory functionas can accept a single array of values too
IDs.factory.string.list(['an', 'array', 'of', 'strings']);
IDs.factory.string.map({a: 'oil', b: 'vinegar'});
```
#### Boolean
```js
IDs.factory.boolean(true);
IDs.factory.boolean.list(true, false, true);
IDs.factory.boolean.list([false, false, true]);
IDs.factory.boolean.map({a: false, b: true});
```
#### Integer
```js
IDs.factory.integer(15);
IDs.factory.integer.list(-10000, 0, 2234);
IDs.factory.integer.list([1, 2, 4]);
IDs.factory.integer.map({a: 55, b: -9550});
```
#### Float
```js
IDs.factory.float(-0.58305);
IDs.factory.float.list(3.665, 0.1, -664.12234);
IDs.factory.float.list([1.1, 2.2, 4.4]);
IDs.factory.float.map({a: 80.1, b: -625.11});
```
#### Long
```js
IDs.factory.long(81225);
// Accepts long-like objects
IDs.factory.long({low: -4434, high: 22});
IDs.factory.long.list(-10, 21, 96);
IDs.factory.long.list([1, 2, 4]);
IDs.factory.long.map({a: 505, b: -95503343432});
```
#### Bytes
```js
IDs.factory.bytes([100, 0, 12, 33]);
// bytes can accept Buffer
IDs.factory.bytes(Buffer.from([255, 0, 128]));
// bytes can accept ArrayBuffer
IDs.factory.bytes(new ArrayBuffer(16));
// bytes can accept Array-Like objects
IDs.factory.bytes(Uint8Array.of(255, 0, 128));
IDs.factory.bytes(Uint8ClampedArray.of(100, 99, 38));
IDs.factory.bytes({length: 2, '0': 1, '1': 75});

IDs.factory.bytes.list([10, 1, 0, 0], [212, 196]);
IDs.factory.bytes.list([[1, 2, 4]]);
IDs.factory.bytes.map({a: [50, 0], b: [45, 61, 121]});
```
### Semantic Identifiers
#### UUID
```js
IDs.factory.uuid();
```
