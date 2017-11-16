import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import * as primitives from "./primitives";
import * as shared from "../shared";


/**
 * Encoded value is the unix/epoch time numerical value.
 */
export const datetimeCodec: IdentifierCodec = {
  ...primitives.integerCodec,
  type: "datetime",
  typeCode: primitives.integerCodec.typeCode | shared.semanticTypeMask,
  validateForIdentifier: (value) => S.assert(S.spec.date, value),
  encode: (date: Date) => date.getTime(),
  decode: (decoded: number) => new Date(decoded)
}