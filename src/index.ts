import {encodeToString} from "./encode";
import {decodeFromString} from "./decode";
import {Factory, createFactory} from "./types/factory";
import {createListCodec} from "./types/lists";
import {registerCodec} from "./types/finder";
import {anyCodec, AnyType} from "./types/any";
import {stringCodec} from "./types/string";
import {booleanCodec} from "./types/boolean";
import {integerCodec} from "./types/integer";
import {floatCodec} from "./types/float";
import {longCodec, LongInput, LongLike} from "./types/long";
import {datetimeCodec, DatetimeInput} from "./types/datetime";
import {IdentifierCodec} from "./identifier";


function processCodec<IN, OUT>(itemCodec: IdentifierCodec): Factory<IN, OUT> {
  const listCodec = createListCodec(itemCodec);
  registerCodec(itemCodec);
  registerCodec(listCodec);
  return createFactory(itemCodec, listCodec);
}

/**
 * Factories for identifiers.
 */
const factory = {
  any: processCodec<AnyType, AnyType>(anyCodec),
  string: processCodec<string, string>(stringCodec),
  boolean: processCodec<boolean, boolean>(booleanCodec),
  integer: processCodec<number, number>(integerCodec),
  float: processCodec<number, number>(floatCodec),
  long: processCodec<LongInput, LongLike>(longCodec),
  datetime: processCodec<DatetimeInput, Date>(datetimeCodec)
}

export {
  encodeToString,
  decodeFromString,
  factory
};