import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";

const booleanSpec = S.spec.predicate("boolean value", S.spec.boolean);

export const booleanCodec: IdentifierCodec<boolean> = {
  type: "boolean",
  typeCode: 0x1,
  specForIdentifier: booleanSpec,
  specForDecoding: booleanSpec,
  forIdentifier: asIsCodec.forIdentifier,
  encode: asIsCodec.encode,
  decode: asIsCodec.decode
};