import * as S from "js.spec";

export const semanticTypeMask = 0x1f;

export const codecSymbol: symbol = Symbol.for("id-codec");

const hasCodecSymbol = (id) => id[codecSymbol];
const hasValue = (value) => value !== null;

export const identifierSpec = S.spec.and("identifier",
  S.spec.map("identifier structure", {
    type: S.spec.string,
    value: hasValue
  }),
  hasCodecSymbol);
