import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";
import {createListCodec} from "./lists";

export const stringCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "string",
  typeCode: 0x1,
  validateForIdentifier: (value) => S.assert(S.spec.string, value),
  validateForDecoding: (value) => S.assert(S.spec.string, value)
}

export const stringListCodec = createListCodec(stringCodec, S.spec.string);