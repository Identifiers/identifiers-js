import * as ids from "../src";


/*
These tests will convert identifiers to and from strings to validate the round trip.
todo Need an identifier factory of some kind

ids.identifier(value) => Figures out codec from value type. Not sure what it will do about object. Wait for mapIdentifier?
ids.stringIdentifier(value) => maps directly to codec. Preferred/faster?
ids.listIdentifier(s1, s2, s3)

Structured identifiers:
listIdentifier -- same-sequence
mapIdentifier (sort by keys)

Semantic identifiers:
UUID: https://en.wikipedia.org/wiki/Universally_unique_identifier
IP: https://stackoverflow.com/questions/8105629/ip-addresses-stored-as-int-results-in-overflow
IPv6: need to learn more https://technet.microsoft.com/en-us/library/cc781672(v=ws.10).aspx
GEO: https://en.wikipedia.org/wiki/Geo_URI_scheme
MAC: https://en.wikipedia.org/wiki/MAC_address

All derive from the primitive and structured identifiers so that if someone doesn't have a codec they
can at least interpret the values.

Use case:
1. I get a string that is an identifier.
2. I decode it.
3. typeCode doesn't exist, but msgpack did decode a value. Which codec is closest?

Could use codec's validateForEncoding() to check for that. Need to prefer integer over float. Any other ties?
Keep the type code in the codec (manufacture a new one?) so if it's re-encoded it will have a chance of success.
*/