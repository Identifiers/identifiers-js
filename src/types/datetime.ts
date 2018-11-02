import * as S from "js.spec";
import * as Long from "long";

import {IdentifierCodec} from "../identifier-codec";
import {EncodedLong, longCodec} from "./long";
import {registerSemanticTypeCode} from "../semantic";
import {createImmutableDate, ImmutableDate} from "./immutable-date";


const datetimeInputSpec = S.spec.or("DatetimeInput spec", {
  "Date": S.spec.date,
  "number": Number.isInteger
});

export type DatetimeInput = number | Date;

function decodeDatetime(encoded: EncodedLong): ImmutableDate {
  if (typeof encoded === "number") {
    return createImmutableDate(encoded);
  }
  return createImmutableDate(longCodec.decode(encoded).toNumber());
}

/**
 * Encoded value is the unix epoch time value. Base type is long.
 */
export const datetimeCodec: IdentifierCodec<DatetimeInput, ImmutableDate, EncodedLong> = {
  type: "datetime",
  typeCode: registerSemanticTypeCode(longCodec.typeCode, 1),
  specForIdentifier: datetimeInputSpec,
  specForDecoding: longCodec.specForDecoding,
  forIdentifier: createImmutableDate,
  toDebugString: (date) => date.toISOString(),
  encode: (date) => Long.fromNumber(date.time),
  decode: decodeDatetime
};