import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {longCodec} from "./long";
import {createListCodec} from "./lists";
import {SEMANTIC_SLOTS} from "./shared-types";


const datetimeSpec = S.spec.or("datetime spec", {
  "Date": S.spec.date,
  "number": Number.isInteger
});

export type DatetimeInput = number | Date;

/**
 * Encoded value is the unix epoch time value. Base type is long.
 */
export const datetimeCodec: IdentifierCodec = {
  type: "datetime",
  typeCode: longCodec.typeCode | SEMANTIC_SLOTS[1],
  validateForIdentifier: (value) => S.assert(datetimeSpec, value),
  // copy value to prevent modification outside this identifier from mutating it's internal state
  forIdentifier: (value) => new Date(typeof value === "number" ? value : value.getTime()),
  encode: (date) => date.getTime(),
  // JS number has sufficient space for Dates; don't need to use Long
  validateForDecoding: (value) => S.assert(Number.isInteger, value),
  decode: (decoded) => new Date(decoded)
}

export const datetimeListCodec = createListCodec(datetimeCodec, datetimeSpec);