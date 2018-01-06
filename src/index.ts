import {encodeToString} from "./encode";
import {decodeFromString} from "./decode";
import {Factory, createFactory} from "./factory";
import {registerCodec} from "./finder";
import {createListCodec} from "./types/lists";
import {anyCodec} from "./types/any";
import {stringCodec} from "./types/string";
import {booleanCodec} from "./types/boolean";
import {integerCodec} from "./types/integer";
import {floatCodec} from "./types/float";
import {longCodec} from "./types/long";
import {datetimeCodec} from "./types/datetime";
import {IdentifierCodec} from "./identifier";
import {bytesCodec} from "./types/bytes";


function processCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>): Factory<INPUT, VALUE> {
  const listCodec = createListCodec(itemCodec);
  registerCodec(itemCodec);
  registerCodec(listCodec);
  return createFactory(itemCodec, listCodec);
}

/**
 * Factories for identifiers.
 */
const factory = {
  any: processCodec(anyCodec),
  string: processCodec(stringCodec),
  boolean: processCodec(booleanCodec),
  integer: processCodec(integerCodec),
  float: processCodec(floatCodec),
  long: processCodec(longCodec),
  bytes: processCodec(bytesCodec),
  datetime: processCodec(datetimeCodec)
}

export {
  encodeToString,
  decodeFromString,
  factory
};