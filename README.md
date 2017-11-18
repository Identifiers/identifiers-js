## JavaScript implementation

###TODO

ids.identifier(value) => Figures out codec from value type. Not sure what it will do about object. Wait for mapIdentifier?

####Structured identifiers
* listIdentifier -- same-sequence
* mapIdentifier (sort by keys)

####Semantic identifiers
* UUID: https://en.wikipedia.org/wiki/Universally_unique_identifier
* IP: https://stackoverflow.com/questions/8105629/ip-addresses-stored-as-int-results-in-overflow
* IPv6: https://technet.microsoft.com/en-us/library/cc781672(v=ws.10).aspx#w2k3tr_ipv6_how_thcz (128 bits--4 ints or 2 longs)
* GEO: https://en.wikipedia.org/wiki/Geo_URI_scheme (looks like floats, but do they need to be doubles?)
* MAC: https://en.wikipedia.org/wiki/MAC_address
* The three-word addressing scheme?

#####Graceful downgrading
All semantic identifiers derive from the primitive and structured identifiers so that if someone doesn't have a codec they
can at least interpret the values.

Use case:
1. I get a string that is an identifier.
2. I decode it.
3. typeCode doesn't exist, but msgpack did decode a value. Which codec is closest?

Could use codec's validateForEncoding() to check for that. Need to prefer integer over float. Any other ties?
Keep the type code in the codec (manufacture a new one?) so if it's re-encoded it will have a chance of success.

How do I extend? 7 isn't enough room. 0  byte is the extension flag to add another byte to the typecode.
Why? 255 can be used for a value that is a structure of primitives, while 0 has no meaning 
What does an extension look like? Same pattern, since one can't use the first byte for types.
That sucks actually because it means each byte can only support 7 new types. 
Could use an actual bit (128) to trigger the extension and then use the first byte to define the base type.
This will allow each new byte to support 127 new semantic types, but restricts the first byte to just 4
semantic types.

If 224 is used as the flag, one could use the rest of the byte to signal the base type, then look to the second byte for the semantic
slot.
