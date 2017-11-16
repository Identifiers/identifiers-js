import {IdentifierCodec} from "../identifier";
import * as S from "js.spec";

/**
 * Encoded value is the unix/epoch time numerical value.
 */
export const datetimeCodec: IdentifierCodec = {
  // todo this is supposed to 'extend' integerCodec?
  type: "datetime",
  typeCode: 13,
  validateForEncoding: (value) => S.assert(S.spec.date, value),
  encode: (date: Date) => date.getTime(),
  validateForDecoding: this.validateForEncoding,
  decode: (decoded: number) => new Date(decoded)
}