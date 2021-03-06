import * as S from "js.spec";

import {IdentifierCodec} from "../identifier-codec";
import {asIsCodec} from "./shared-types";


//32-bit signed value range
const MIN_INT = -0x80000000;
const MAX_INT = 0x7fffffff;

function is32BitInteger(value: number) {
  return value >= MIN_INT && value <= MAX_INT;
}

/**
 * Spec for 32-bit integer values.
 */
export const integerSpec = S.spec.and("integer value",
  Number.isInteger,
  is32BitInteger
);

export const integerCodec: IdentifierCodec<number> = {
  type: "integer",
  typeCode: 0x2,
  specForIdentifier: integerSpec,
  specForDecoding: integerSpec,
  forIdentifier: asIsCodec.forIdentifier,
  toDebugString: asIsCodec.toDebugString,
  encode: asIsCodec.encode,
  decode: asIsCodec.decode
};
