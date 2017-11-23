import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";
import * as S from "js.spec";
import {createListCodec} from "./lists";

export const booleanCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "boolean",
  typeCode: 0x2,
  validateForIdentifier: (value) => S.assert(S.spec.boolean, value),
  validateForDecoding: (value) => S.assert(S.spec.boolean, value)
}

export const booleanListCodec = createListCodec(booleanCodec, S.spec.boolean);