import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";
import {createListCodec} from "./lists";

//32-bit signed value
const MAX_INT = 2 ** 31;
const MIN_INT = -MAX_INT;
const integerRangeSpec = (value) => value >= MIN_INT && value < MAX_INT;

export const integerSpec = S.spec.and("integer value",
  Number.isInteger,
  integerRangeSpec
);

export const integerCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "integer",
  typeCode: 0x3,
  validateForIdentifier: (value) => S.assert(integerSpec, value),
  validateForDecoding: (value) => S.assert(integerSpec, value)
}

export const integerListCodec = createListCodec(integerCodec, integerSpec);