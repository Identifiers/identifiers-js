import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {longCodec} from "./long";
import {createListCodec} from "./lists";
import {SEMANTIC_SLOTS} from "./shared-types";


const datetimeSpec = S.spec.or("datetime spec", {
  "Date": S.spec.date,
  "number": Number.isInteger
});

/**
 * Encoded value is the unix time value. Base type is long.
 */
export const datetimeCodec: IdentifierCodec = {
  type: "datetime",
  typeCode: longCodec.typeCode | SEMANTIC_SLOTS[1],
  validateForIdentifier: (value) => S.assert(datetimeSpec, value),
  // JS number has sufficient space for Dates; don't need to use Long
  validateForDecoding: (value) => S.assert(Number.isInteger, value),
  forIdentifier: (value) => typeof value === "number" ? new Date(value) : value,
  encode: (date) => date.getTime(),
  decode: (decoded) => new Date(decoded)
}

export const datetimeListCodec = createListCodec(datetimeCodec, datetimeSpec);