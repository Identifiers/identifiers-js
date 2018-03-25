## JavaScript implementation of [Identifiers spec](https://github.com/Identifiers/spec)

[![Build Status](https://travis-ci.org/Identifiers/identifiers-js.svg?branch=master)](https://travis-ci.org/Identifiers/identifiers-js)
[![Coverage Status](https://coveralls.io/repos/github/Identifiers/identifiers-js/badge.svg?branch=master)](https://coveralls.io/github/Identifiers/identifiers-js?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/identifiers/identifiers-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/identifiers/identifiers-js?targetFile=package.json)

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

#### Future Possibilities
* IP: https://stackoverflow.com/questions/8105629/ip-addresses-stored-as-int-results-in-overflow (integer)
* IPv6: https://technet.microsoft.com/en-us/library/cc781672(v=ws.10).aspx#w2k3tr_ipv6_how_thcz (128 bits--2 longs)
* MAC: https://en.wikipedia.org/wiki/MAC_address
* Flicks: https://github.com/OculusVR/Flicks
* The three-word addresses: http://what3words.com
* Currency
* Locale

##### Graceful unknown type handling
All semantic identifiers derive from the primitive and structured identifiers so that if someone doesn't have a codec they
can at least interpret the values.

Use case:

1. I get a string that is an identifier.
2. I decode it.
3. It's typeCode doesn't exist, but msgpack did decode a value. Which codec is the base codec? That's what is used to handle the identifier value.
4. You can re-encode the identifier to store or transmit elsewhere.

