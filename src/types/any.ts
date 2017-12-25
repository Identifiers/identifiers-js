import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";

export type AnyType = string | number | boolean;

export const anySpec = S.spec.or("any primitive identifier type", {
  "string": S.spec.string,
  "boolean": S.spec.boolean,
  "number": S.spec.finite
});

export const anyCodec: IdentifierCodec<AnyType> = {
  ...asIsCodec,
  type: "any",
  typeCode: 0x0,
  specForIdentifier: anySpec,
  specForDecoding: anySpec
};
