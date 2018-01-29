import {decodeFromString} from "./decode";
import {Factory, createFactory} from "./factory";
import {JSON_reviver} from "./jsonReviver";
import {IdentifierCodec} from "./identifier";
import {registerCodec} from "./finder";
import {createListCodec} from "./types/lists";
import {createMapCodec} from "./types/maps";
import {stringCodec} from "./types/string";
import {booleanCodec} from "./types/boolean";
import {integerCodec} from "./types/integer";
import {floatCodec} from "./types/float";
import {longCodec} from "./types/long";
import {datetimeCodec} from "./types/datetime";
import {bytesCodec} from "./types/bytes";

function processCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>): Factory<INPUT, VALUE> {
  const listCodec = createListCodec(itemCodec);
  const mapCodec = createMapCodec(itemCodec);
  registerCodec(itemCodec);
  registerCodec(listCodec);
  registerCodec(mapCodec);
  return createFactory(itemCodec, listCodec, mapCodec);
}

/**
 * Factories for identifiers.
 */
const factory = {
  string: processCodec(stringCodec),
  boolean: processCodec(booleanCodec),
  integer: processCodec(integerCodec),
  float: processCodec(floatCodec),
  long: processCodec(longCodec),
  bytes: processCodec(bytesCodec),
  datetime: processCodec(datetimeCodec)
}

export {
  factory,
  decodeFromString,
  JSON_reviver
};