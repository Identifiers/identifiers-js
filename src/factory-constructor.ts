import * as Long from "long";

import {IdentifierCodec} from "./identifier-codec";
import {CompositeFactory, createFactory, createListFactory, createMapFactory, Factory} from "./factory";
import {createListCodec} from "./types/lists";
import {createMapCodec} from "./types/maps";
import {registerCodec} from "./finder";
import * as composite from "./types/composite";
import {stringCodec} from "./types/string";
import {booleanCodec} from "./types/boolean";
import {integerCodec} from "./types/integer";
import {floatCodec} from "./types/float";
import {longCodec} from "./types/long";
import {bytesCodec} from "./types/bytes";
import {uuidCodec} from "./types/uuid";
import {datetimeCodec} from "./types/datetime";
import {geoCodec} from "./types/geo";
import {LongInput} from "./types/long";
import {DatetimeInput} from "./types/datetime";
import {BytesInput} from "./types/bytes";
import {UuidInput, UuidLike} from "./types/uuid";
import {ImmutableDate} from "./types/immutable-date";
import {GeoInput, GeoLike} from "./types/geo";

export interface Factories {
  readonly string: Factory<string, string>
  readonly boolean: Factory<boolean, boolean>
  readonly integer: Factory<number, number>
  readonly float: Factory<number, number>
  readonly long: Factory<LongInput, Long>
  readonly bytes: Factory<BytesInput, number[]>
  readonly uuid: Factory<UuidInput, UuidLike>
  readonly datetime: Factory<DatetimeInput, ImmutableDate>
  readonly geo: Factory<GeoInput, GeoLike>
  readonly composite: CompositeFactory
}

export function processCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>): Factory<INPUT, VALUE> {
  const listCodec = createListCodec(itemCodec);
  const mapCodec = createMapCodec(itemCodec);
  registerCodec(itemCodec);
  registerCodec(listCodec);
  registerCodec(mapCodec);
  return createFactory(itemCodec, listCodec, mapCodec);
}

export function createCompositeFactory(): CompositeFactory {
  registerCodec(composite.listCodec);
  registerCodec(composite.mapCodec);
  return {
    list: createListFactory(composite.listCodec),
    map: createMapFactory(composite.mapCodec)
  };
}

/**
 * Factories for identifiers.
 */
export const factory: Factories = {
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
