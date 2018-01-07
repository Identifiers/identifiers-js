import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";

export const floatCodec: IdentifierCodec<number> = {
  ...asIsCodec,
  type: "float",
  typeCode: 0x3,
  specForIdentifier: S.spec.finite,
  specForDecoding: S.spec.finite
};
