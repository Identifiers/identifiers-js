import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import * as primitives from "./primitives";

const SLOTS = [0x20, 0x40, 0x60, 0x80, 0xa0, 0xc0];
const EXT = 0xe0;

/**
 * Encoded value is the unix time value. Base type is long.
 */
export const datetimeCodec: IdentifierCodec = {
  type: "datetime",
  typeCode: primitives.longCodec.typeCode | SLOTS[1],
  validateForIdentifier: (value) => S.assert(S.spec.date, value),
  // JS number has sufficient space for Dates; don't need to use google Long
  validateForDecoding: (value) => S.assert(S.spec.number, value),
  forIdentifier: (value) => value,
  encode: (date: Date) => date.getTime(),
  decode: (decoded: number) => new Date(decoded)
}