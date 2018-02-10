## JavaScript implementation

[![Build Status](https://travis-ci.org/Identifiers/identifiers-js.svg?branch=master)](https://travis-ci.org/Identifiers/identifiers-js)
[![Coverage Status](https://coveralls.io/repos/github/Identifiers/identifiers-js/badge.svg?branch=master)](https://coveralls.io/github/Identifiers/identifiers-js?branch=master)

#### Primitive identifiers
* string -- utf-8 string
* boolean -- true or false
* integer -- 32-bit signed ints
* float -- 64-bit signed decimals (IEEE 754)
* long -- 64-bit signed ints
* bytes -- array of bytes

#### Structured identifiers
* list -- same-sequence
* map (sort by keys)

#### Semantic identifiers
* Datetime: unix time, see if you can find some kid of spec for this. base type is number
* UUID: https://en.wikipedia.org/wiki/Universally_unique_identifier. Many types, see if you need to split them out into their spaces

#### More to come
* IP: https://stackoverflow.com/questions/8105629/ip-addresses-stored-as-int-results-in-overflow (integer)
* IPv6: https://technet.microsoft.com/en-us/library/cc781672(v=ws.10).aspx#w2k3tr_ipv6_how_thcz (128 bits--2 longs)
* GEO: https://en.wikipedia.org/wiki/Geotagging
* MAC: https://en.wikipedia.org/wiki/MAC_address
* The three-word addresses: http://what3words.com
* currency?
* Locale?

##### Graceful unknown type handling
All semantic identifiers derive from the primitive and structured identifiers so that if someone doesn't have a codec they
can at least interpret the values.

Use case:
1. I get a string that is an identifier.
2. I decode it.
3. typeCode doesn't exist, but msgpack did decode a value. Which codec is the base codec? That's what is used to handle the identifier value.
4. You an re-encode the identifier to store and transmit elsewhere.


TODO: package.json keywords field