import * as S from "js.spec";

import {IdentifierCodec} from "../identifier-codec";
import {longCodec} from "./long";
import {calculateSemanticTypeCode} from "../semantic";
import {createImmutableDate, ImmutableDate} from "./immutable-date";


const datetimeInputSpec = S.spec.or("DatetimeInput spec", {
  "Date": S.spec.date,
  "number": Number.isInteger
});

const decodeSpec = S.spec.predicate("datetime decoded", Number.isInteger);

export type DatetimeInput = number | Date;

/**
 * Encoded value is the unix epoch time value. Base type is long.
 */
export const datetimeCodec: IdentifierCodec<DatetimeInput, ImmutableDate, number> = {
  type: "datetime",
  typeCode: calculateSemanticTypeCode(longCodec.typeCode, 1),
  specForIdentifier: datetimeInputSpec,
  // JS number has sufficient space for Dates; don't need to use Long
  specForDecoding: decodeSpec,
  forIdentifier: createImmutableDate,
  toDebugString: (date) => date.toISOString(),
  encode: (date) => date.time,
  decode: createImmutableDate
};