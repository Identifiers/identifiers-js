import * as S from "js.spec";

export const semanticTypeMask = 0x1f;

export const codecSymbol: symbol = Symbol.for("id-codec");

export function hasValue(value) {
  return value !== null;
}

const hasCodecSymbol = (id) => id[codecSymbol];

export const identifierSpec = S.spec.and("identifier",
  S.spec.map("identifier structure", {
    type: S.spec.string,
    value: hasValue
  }),
  hasCodecSymbol);
