import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";
import * as S from "js.spec";
import {createListCodec} from "./lists";

//32-bit signed value
const MIN_INT = -(2 ** 31);
const MAX_INT = 2 ** 31 - 1;
const integerRangeSpec = (value) => value > MIN_INT && value < MAX_INT;

const integerSpec = S.spec.and("integer value",
    S.spec.integer,
    integerRangeSpec);

export const integerCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "integer",
  typeCode: 0x3,
  validateForIdentifier: (value) => S.assert(integerSpec, value),
  validateForDecoding: (value) => S.assert(integerSpec, value)
}

export const integerListCodec = createListCodec(integerCodec, integerSpec);