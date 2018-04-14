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
const IDs = require('identifiers');
```
The `IDs` reference comes with methods to parse Identifier strings as well as a factory to create Identifier instances.
#### Immutability
Identifier instances are immutable. Their values are also immutable.

```js
const integerId = IDs.factory.integer(22);
/*
  Identifiers have the following shape:
  {
  	value: data value
  	type: identifier type string
  	toString() -> returns Base-128 encoded identifier string
  	toBase32String() -> return Base-32 encoded identifier string
  	toJSON() -> called by JSON.stringify() and returns Base-128 encoded identifier string
  }
 */
console.log(integerId.value);
// -> 22

// encode the identifier
const dataString = integerId.toString();
const humanString = integerId.toBase32String();

// decode the identifier
const decodedId = IDs.parse(dataString);
// parse() can decode either type of encoded string
const decodedId2 = IDs.parse(humanString);

console.log(decodedId.value === decodedId2.value);
// -> true
```
### Lists and Map Identifiers
Identifiers-js supports list and map identifiers in the factories. Each type factory has a `.list()` and `.map()` factory method which sets the type of structure.

```js
const listId = IDs.factory.boolean.list(true, true, false);
const mapId = IDs.factory.long.map({a: 335843, b: -997});
```

### JSON Support
Identifiers-js has support for both generating and parsing JSON data values. Identifier instances safely encode themselves into a `JSON.stringify()` process. Additionally, a JSON [`reviver`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) is provided for `JSON.parse()` calls.

```js
const id = IDs.factory.string('Hello, World!');
const anObject = { a: 'a message', b: id };
const json = JSON.stringify(anObject);

console.log(json);
// -> { "a": "a message", "b": "Ç/IÒÁIÖêqÉ34uwâêl7Tþ" }

const parsedObject = JSON.parse(json, IDs.JSON_reviver);
const parsedId = parsedObject.b;

console.log(parsedId.value);
// -> 'Hello, World!'
```
For further details see the [API Reference](#api-reference) section.

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
* UUID: Supports encoding all types. [https://en.wikipedia.org/wiki/Universally_unique_identifier]()
* datetime: unix time. Base type is long. [https://en.wikipedia.org/wiki/Unix_time]()
* geo: Decimal latitude and longitude. [https://en.wikipedia.org/wiki/Geotagging]()

# API Reference


### Create Identifiers with Factory Methods
The factory has methods for each type of identifier. These methods can consume various inputs to build an identifier.

Each identifier type's factory has methods to construct structural identifiers of their type. Each structural factory method accepts the same inputs as the single value methods, but in structural form.
#### String
```js
const id = IDs.factory.string('Hello');
console.log(typeof id.value);
// -> 'string'

// list factory functions can accept a vararg of values
IDs.factory.string.list('Hello', 'friend', 'welcome!');
// list factory functions can accept a single array of values too
IDs.factory.string.list(['an', 'array', 'of', 'strings']);

IDs.factory.string.map({a: 'oil', b: 'vinegar'});
```
#### Boolean
```js
const id = IDs.factory.boolean(true);
console.log(typeof id.value);
// -> 'boolean'

IDs.factory.boolean.list(true, false, true);
IDs.factory.boolean.list([false, false, true]);

IDs.factory.boolean.map({a: false, b: true});
```
#### Integer
```js
const id = IDs.factory.integer(15);
console.log(typeof id.value);
// -> 'number'

IDs.factory.integer.list(-10000, 0, 2234);
IDs.factory.integer.list([1, 2, 4]);

IDs.factory.integer.map({a: 55, b: -9550});
```
#### Float
```js
const id = IDs.factory.float(-0.58305);
console.log(typeof id.value);
// -> 'number'

IDs.factory.float.list(3.665, 0.1, -664.12234);
IDs.factory.float.list([1.1, 2.2, 4.4]);

IDs.factory.float.map({a: 80.1, b: -625.11});
```
#### Long
```js
const id = IDs.factory.long(8125);
console.log(typeof id.value);
// -> 'object'
// id is a long-like object
console.log(id.value)
// { low: 8125, high: 0 }

// Accepts long-like objects
IDs.factory.long({low: -4434, high: 22});
IDs.factory.long.list(-10, 21, {low: 96, high: 34});
IDs.factory.long.list([{low: 224456, high: -4}, 2, 4]);

IDs.factory.long.map({a: {low: -1, high: 0}, b: -95503343432});
```
#### Bytes
```js
const id = IDs.factory.bytes([100, 0, 12, 33]);
console.log(typeof id.value);
// -> 'array'

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
Base identifier type is [bytes](#bytes) so the factory accepts multiple types of byte array inputs. The array-like input must contain 16 bytes. The factory also accepts a uuid-encoded string.
```js
// UUID encoded string
const id = IDs.factory.uuid('8cdcbe23-c04e-4ea2-ae51-15c9cf16e1b3');
console.log(typeof id.value);
// -> 'object'
/*
  uuid's id.value is a uuid-like object: 
  {
    bytes: array of 16 bytes
    toString() -> uuid-encoded string
  }
 */

// Accepts a 16-byte array, as well as any other array-like type the bytes identifier accepts
IDs.factory.uuid([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
IDs.factory.uuid(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));
IDs.factory.uuid(Uint8Array.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15));

// can mix input types in factory
IDs.factory.uuid.list([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '13f3eae9-18d6-46fc-9b3a-d6d32aaee26c');
// can accept a single array of values
IDs.factory.uuid.list([
  'cebfc569-2ba6-4cd7-ba25-f51d64c13087', 
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 
  Uint8ClampedArray.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)]);

IDs.factory.uuid.map({
  a: '7894746d-62a5-425f-adb7-0a609ababf3f',
  b: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
});
```
#### Datetime
Base identifier type is [long](#long) so the factory accepts the same multiple types of long inputs. It also accepts a JS Date object as an input.
```js
const id = IDs.factory.datetime(new Date());
console.log(typeof id.value)
// -> 'object'
/*
  datetime produces an immutable Date-like object with some of the methods in Date implemented:
  {
    time: number // the unix time value
    toString() -> same as Date.toString()
    toUTCString() -> same as Date.toUTCString()
    toISOString() -> same as Date.toISOString()
    toJSON(key) -> same as Date.toJSON(key)
    toDate() -> returns a standard JS Date instance. Changes to this object will not affect the Identifier
  }
 */

//accepts unix time values
IDs.factory.datetime(10000000);

IDs.factory.datetime.list(new Date(), 10000000);
IDs.factory.datetime.list([3576585434, new Date(10000000)]);

IDs.factory.datetime.map({a: 3576585434, b: new Date()});
```
#### Geo
Base identifier type of geo is a [list of 2 floats](#float). Factory only accepts a geo-like objects:
```js
/*
  {
    latitude: number between -90.0 and 90.0
    longitude: number between -180.0 and 180.0
  }
 */
const id = IDs.factory.geo({latitude: 14.8653, longitude: -23.0987877});
console.log(typeof id.value)
// -> 'object'
/* 
  geo produces a geo-like object identical to the input object shape:
  {
    latitude: number between -90.0 and 90.0
    longitude: number between -180.0 and 180.0
  }
 */

IDs.factory.geo.list({latitude: 14.8653, longitude: -23.0987877}, {latitude: 90.0, longitude: 100.7685944});
// accepts a single array of geos
IDs.factory.geo.list([{latitude: 0.23433, longitude: -0.1001002}, {latitude: 0.0, longitude: 10.11}]);

IDs.factory.geo.map({a: {latitude: 14.262, longitude: -123.0923}, b: {latitude: 10.0021, longitude: 90.4}});
```