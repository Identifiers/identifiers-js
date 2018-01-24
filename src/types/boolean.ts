import * as S from "js.spec";

import {Identifier, IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";

export const booleanCodec: IdentifierCodec<boolean> = {
  ...asIsCodec,
  type: "boolean",
  typeCode: 0x1,
  specForIdentifier: S.spec.boolean,
  specForDecoding: S.spec.boolean
};

/*
  Are these classes publicly available? I think no because we don't want them constructed outside of factories.
  Let's see what they look like in practice, but I am liking this so far.
 */
export class BooleanIdentifier extends Identifier<boolean> {
  constructor(value: boolean) {
    super(value);
  }

  protected codec(): IdentifierCodec {
    return booleanCodec;
  }
}
