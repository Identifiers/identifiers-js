import * as S from "js.spec";

import {IdentifierCodec} from "../identifier-codec";
import {asIsCodec} from "./shared-types";


const stringSpec = S.spec.predicate("string spec", S.spec.string);

export const stringCodec: IdentifierCodec<string> = {
  type: "string",
  typeCode: 0x0,
  specForIdentifier: stringSpec,
  specForDecoding: stringSpec,
  forIdentifier: asIsCodec.forIdentifier,
  toDebugString: asIsCodec.toDebugString,
  encode: asIsCodec.encode,
  decode: asIsCodec.decode
};