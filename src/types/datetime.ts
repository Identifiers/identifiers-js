import * as S from "js.spec";

import {IdentifierCodec} from "../identifier-codec";
import {EncodedLong, longCodec} from "./long";
import {registerSemanticTypeCode} from "../semantic";
import {createImmutableDate, ImmutableDate} from "./immutable-date";
import {isNumber} from "../shared";


export type DatetimeInput = number | Date;


const datetimeInputSpec = S.spec.or("DatetimeInput spec", {
  "Date": S.spec.date,
  "number": Number.isInteger
});

function decodeDatetime(encoded: EncodedLong): ImmutableDate {
  const value = isNumber(encoded)
    ? encoded
    : Number(longCodec.decode(encoded));
  return createImmutableDate(value);
}

function toDebugString(date: ImmutableDate): string {
  return date.toISOString();
}

function encodeDatetime(date: ImmutableDate): number {
  return date.time;
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
  toDebugString: toDebugString,
  encode: encodeDatetime,
  decode: decodeDatetime
};