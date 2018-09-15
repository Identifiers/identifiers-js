/**
* TypeScript definitions for Identifiers.
*/
import {Identifier} from "./identifier";

export {factory, decodeFromString, JSON_reviver} from "./index";
export {Identifier} from "./identifier";
export {MapIdentifier} from "./shared";
export {Factory, ListFactory, MapFactory, CompositeFactory} from "./factory";

import * as LONG from "./types/long";
export namespace long {
  /**
   * Input type for long identifier that takes either a number or a Long-like object. Some Long-like objects
   * have an unsigned field. This field should be false if present as Longs in Identifiers are signed.
   */
  export type LongInput = LONG.LongInput;
  export type LongLike = LONG.LongLike;
}

import * as BYTES from "./types/bytes";
export namespace bytes {
  export type BytesInput = BYTES.BytesInput;
}

import * as UUID from "./types/uuid";
export namespace uuid {
  export type UuidInput = UUID.UuidInput;
  export type UuidLike = UUID.UuidLike;
}

import * as DATETIME from "./types/datetime";
import * as IDATE from "./types/immutable-date";
export namespace datetime {
  export type DatetimeInput = DATETIME.DatetimeInput;
  /**
   * Identifier-centric immutable wrapper around a Date instance. It provides the Date methods often used in system that
   * treat dates as identifiers. One can get a Date instance for other cases.
   */
  export type ImmutableDate = IDATE.ImmutableDate;
}

import * as GEO from "./types/geo";
export namespace geo {
  export type GeoInput = GEO.GeoInput;
  export type GeoLike = GEO.GeoLike;
}

import * as COMPOSITE from "./types/composite";
export namespace composite {
  export type IdList = COMPOSITE.CompositeIdList;
  export type IdMap = COMPOSITE.CompositeIdMap;
}