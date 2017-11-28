import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";
import {createListCodec} from "./lists";

export const floatCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "float",
  typeCode: 0x4,
  validateForIdentifier: (value) => S.assert(S.spec.number, value), // todo change to S.spec.finite when PR is merged
  validateForDecoding: (value) => S.assert(S.spec.number, value)
}

export const floatListCodec = createListCodec(floatCodec, S.spec.number);