import * as S from "js.spec";

export const semanticTypeMask = 0x1f;

export const codecSymbol: symbol = Symbol.for("id-codec");

export function exists(value: any): boolean {
  return !!value || value !== null;
}

const codecSpec = S.spec.map("codec", {
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
    value: exists
  }));
