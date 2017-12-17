import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";

export const booleanCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "boolean",
  typeCode: 0x2,
  specForIdentifier: S.spec.boolean,
  specForDecoding: S.spec.boolean
}
