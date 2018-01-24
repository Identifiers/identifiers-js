import * as S from "js.spec";

import {Identifier, IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";


export const stringCodec: IdentifierCodec<string> = {
  ...asIsCodec,
  type: "string",
  typeCode: 0x0,
  specForIdentifier: S.spec.string,
  specForDecoding: S.spec.string
};

export class StringIdentifier extends Identifier<string> {
  constructor(value: string) {
    super(value);
  }

  protected codec(): IdentifierCodec {
    return stringCodec;
  }
}