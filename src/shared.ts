import * as S from "js.spec";

export const semanticTypeMask = 0x1f;

export const codecSymbol: symbol = Symbol.for("id-codec");

// todo tests
export const identifierSpec = S.spec.and("existing identifier",
    S.spec.object,
    (id) => id[codecSymbol]);
