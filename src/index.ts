import {decodeFromString} from "./decode";
import {Factory, createFactory, CompositeFactory, createListFactory, createMapFactory} from "./factory";
import {JSON_reviver} from "./json-reviver";
import {IdentifierCodec} from "./identifier";
import {registerCodec} from "./finder";
import {createListCodec} from "./types/lists";
import {createMapCodec} from "./types/maps";
import {stringCodec} from "./types/string";
import {booleanCodec} from "./types/boolean";
import * as composite from "./types/composite";
import {integerCodec} from "./types/integer";
import {floatCodec} from "./types/float";
import {longCodec, LongInput, LongLike} from "./types/long";
import {datetimeCodec, DatetimeInput} from "./types/datetime";
import {bytesCodec, BytesInput} from "./types/bytes";
import {uuidCodec, UuidInput, UuidLike} from "./types/uuid";
import {ImmutableDate} from "./types/immutable-date";
import {geoCodec, GeoInput, GeoLike} from "./types/geo";


function processCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>): Factory<INPUT, VALUE> {
  const listCodec = createListCodec(itemCodec);
  const mapCodec = createMapCodec(itemCodec);
  registerCodec(itemCodec);
  registerCodec(listCodec);
  registerCodec(mapCodec);
  return createFactory(itemCodec, listCodec, mapCodec);
}

function createCompositeFactory(): CompositeFactory {
  registerCodec(composite.listCodec);
  registerCodec(composite.mapCodec);
  return {
    list: createListFactory(composite.listCodec),
    map: createMapFactory(composite.mapCodec)
  };
}

export interface Factories {
  readonly string: Factory<string, string>
  readonly boolean: Factory<boolean, boolean>
  readonly integer: Factory<number, number>
  readonly float: Factory<number, number>
  readonly long: Factory<LongInput, LongLike>
  readonly bytes: Factory<BytesInput, number[]>
  readonly uuid: Factory<UuidInput, UuidLike>
  readonly datetime: Factory<DatetimeInput, ImmutableDate>
  readonly geo: Factory<GeoInput, GeoLike>
  readonly composite: CompositeFactory
}

/**
 * Factories for identifiers.
 */
const factory: Factories = {
  string: processCodec(stringCodec),
  boolean: processCodec(booleanCodec),
  integer: processCodec(integerCodec),
  float: processCodec(floatCodec),
  long: processCodec(longCodec),
  bytes: processCodec(bytesCodec),
  uuid: processCodec(uuidCodec),
  datetime: processCodec(datetimeCodec),
  geo: processCodec(geoCodec),
  composite: createCompositeFactory()
};

export {
  factory,
  decodeFromString,
  JSON_reviver
};