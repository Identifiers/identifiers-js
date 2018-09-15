import * as S from "js.spec";

import {IdentifierCodec} from "../identifier-codec";
import {asIsCodec} from "./shared-types";

const floatSpec = S.spec.predicate("float value", S.spec.finite);

export const floatCodec: IdentifierCodec<number> = {
  type: "float",
  typeCode: 0x3,
  specForIdentifier: floatSpec,
  specForDecoding: floatSpec,
  forIdentifier: asIsCodec.forIdentifier,
  toDebugString: asIsCodec.toDebugString,
  encode: asIsCodec.encode,
  decode: asIsCodec.decode
};
