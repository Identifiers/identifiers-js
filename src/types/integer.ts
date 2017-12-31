import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";


//32-bit signed value
const MAX_INT = 2 ** 31;
const MIN_INT = -MAX_INT;
const integerRangeSpec = (value) => value >= MIN_INT && value < MAX_INT;

/**
 * Spec for 32-bit integer values.
 */
export const integerSpec = S.spec.and("integer value",
  Number.isInteger,
  integerRangeSpec
);

export const integerCodec: IdentifierCodec<number> = {
  ...asIsCodec,
  type: "integer",
  typeCode: 0x3,
  specForIdentifier: integerSpec,
  specForDecoding: integerSpec
};
