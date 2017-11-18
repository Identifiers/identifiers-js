import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import * as primitives from "./primitives";

const SLOTS = [0x20, 0x40, 0x60, 0x80, 0xa0, 0xc0];
const EXT = 0xe0;

/**
 * Encoded value is the unix time integer value. Base type is integer.
 */
export const datetimeCodec: IdentifierCodec = {
  ...primitives.integerCodec,
  type: "datetime",
  typeCode: primitives.integerCodec.typeCode | SLOTS[1],
  validateForIdentifier: (value) => S.assert(S.spec.date, value),
  encode: (date: Date) => date.getTime(),
  decode: (decoded: number) => new Date(decoded)
}