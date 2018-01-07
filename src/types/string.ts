import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";


export const stringCodec: IdentifierCodec<string> = {
  ...asIsCodec,
  type: "string",
  typeCode: 0x0,
  specForIdentifier: S.spec.string,
  specForDecoding: S.spec.string
};