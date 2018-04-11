## JavaScript implementation of [Identifiers spec](https://github.com/Identifiers/spec)

[![Build Status](https://travis-ci.org/Identifiers/identifiers-js.svg?branch=master)](https://travis-ci.org/Identifiers/identifiers-js)
[![Coverage Status](https://coveralls.io/repos/github/Identifiers/identifiers-js/badge.svg?branch=master)](https://coveralls.io/github/Identifiers/identifiers-js?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/identifiers/identifiers-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/identifiers/identifiers-js?targetFile=package.json)

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

