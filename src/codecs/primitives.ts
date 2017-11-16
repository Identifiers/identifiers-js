import * as S from "js.spec";
import * as long from "long";

import {IdentifierCodec} from "../identifier";

// todo these codecs need to be documented in the identifiers spec

const asIsCodec = {
  encode: (value) => value,
  decode: (decoded) => decoded
}

export const stringCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "string",
  typeCode: 0,
  validateForEncoding: (value) => S.assert(S.spec.string, value),
  validateForDecoding: (value) => S.assert(S.spec.string, value)
}

export const booleanCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "boolean",
  typeCode: 1,
  validateForEncoding: (value) => S.assert(S.spec.boolean, value),
  validateForDecoding: (value) => S.assert(S.spec.boolean, value)
}

export const floatCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "float",
  typeCode: 2,
  validateForEncoding: (value) => S.assert(S.spec.number, value), // todo change to S.spec.finite when PR is merged
  validateForDecoding: (value) => S.assert(S.spec.number, value)
}

export const integerCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "integer",
  typeCode: 3,
  validateForEncoding: (value) => S.assert(S.spec.integer, value),
  validateForDecoding: (value) => S.assert(S.spec.integer, value)
}

const longSpec = S.spec.or("long", {
  "google long": long.isLong,
  "integer": S.spec.integer
});
export const longCodec: IdentifierCodec = {
  encode: (value) => long.isLong(value) ? value : long.fromInt(value),
  decode: (decoded) => decoded, //assuming it is a google long
  type: "long",
  typeCode: 4,
  validateForEncoding: (value) => S.assert(longSpec, value),
  validateForDecoding: (value) => {
    if (!long.isLong(value)) {
      throw new Error("only decodes google longs");
    }
  }
}
