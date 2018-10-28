import * as S from "js.spec";
import {Float} from "msgpack-typed-numbers";

import {IdentifierCodec} from "../identifier-codec";
import {asIsCodec} from "./shared-types";

const floatSpec = S.spec.predicate("float value", S.spec.finite);

// msgpack encodes Float, but decodes to number
export type EncodedFloat = number | Float;

export const floatCodec: IdentifierCodec<number, number, EncodedFloat> = {
  type: "float",
  typeCode: 0x3,
  specForIdentifier: floatSpec,
  specForDecoding: floatSpec,
  forIdentifier: asIsCodec.forIdentifier,
  toDebugString: asIsCodec.toDebugString,
  encode: (value) => new Float(value),
  decode: asIsCodec.decode
};
