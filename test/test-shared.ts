import * as S from "js.spec";

import {codecSymbol, existsPredicate} from "../src/shared";


export const codecSpec = S.spec.map("codec", {
  typeCode: S.spec.integer,
  type: S.spec.string,
  validateForIdentifier: S.spec.fn,
  validateForDecoding: S.spec.fn,
  forIdentifier: S.spec.fn,
  encode: S.spec.fn,
  decode: S.spec.fn,
});

function hasCodecSymbol(id: any): boolean {
  return S.valid(codecSpec, id[codecSymbol]);
}

export const identifierSpec = S.spec.and("identifier",
  hasCodecSymbol,
  S.spec.map("identifier structure", {
    type: S.spec.string,
    value: existsPredicate
  }));
