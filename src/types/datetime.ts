import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {longCodec} from "./long";
import {calculateSemanticTypeCode} from "../semantic";
import {createImmutableDate, ImmutableDate} from "./immutable-date";


const datetimeSpec = S.spec.or("datetime spec", {
  "Date": S.spec.date,
  "number": Number.isInteger
});

export type DatetimeInput = number | Date;

/**
 * Encoded value is the unix epoch time value. Base type is long.
 */
export const datetimeCodec: IdentifierCodec<DatetimeInput, ImmutableDate, number> = {
  type: "datetime",
  typeCode: calculateSemanticTypeCode(longCodec.typeCode, 1),
  specForIdentifier: datetimeSpec,
  forIdentifier: createImmutableDate,
  encode: (date) => date.time,
  // JS number has sufficient space for Dates; don't need to use Long
  specForDecoding: S.spec.integer, // todo: S.spec.predicate("datetime", Number.isInteger) as spec.integer is slow
  decode: createImmutableDate
};