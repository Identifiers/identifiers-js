import * as S from "js.spec";
import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";
import {createListCodec} from "./lists";

export const anySpec = S.spec.or("any identifier type", {
  "string": S.spec.string,
  "boolean": S.spec.boolean,
  "number": S.spec.number
});

export const anyCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "any",
  typeCode: 0x0,
  validateForIdentifier: (value) => S.assert(anySpec, value),
  validateForDecoding: (value) => S.assert(anySpec, value)
}

export const anyListCodec = createListCodec(anyCodec, anySpec);