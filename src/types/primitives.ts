import * as S from "js.spec";
import * as Long from "long";

import {IdentifierCodec} from "../identifier";

// todo these codecs need to be documented in the identifiers spec

const asIsCodec = {
  forIdentifier: (value) => value,
  encode: (value) => value,
  decode: (value) => value
}

export const stringCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "string",
  typeCode: 0,
  validateForIdentifier: (value) => S.assert(S.spec.string, value),
  validateForDecoding: (value) => S.assert(S.spec.string, value)
}

export const booleanCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "boolean",
  typeCode: 1,
  validateForIdentifier: (value) => S.assert(S.spec.boolean, value),
  validateForDecoding: (value) => S.assert(S.spec.boolean, value)
}

export const floatCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "float",
  typeCode: 2,
  validateForIdentifier: (value) => S.assert(S.spec.number, value), // todo change to S.spec.finite when PR is merged
  validateForDecoding: (value) => S.assert(S.spec.number, value)
}

export const integerCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "integer",
  typeCode: 3,
  validateForIdentifier: (value) => S.assert(S.spec.integer, value),
  validateForDecoding: (value) => S.assert(S.spec.integer, value)
}

const longSpec = S.spec.or("long", {
  "google long": Long.isLong,
  "integer": S.spec.integer
});
export const longCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "long",
  typeCode: 4,
  validateForIdentifier: (value) => S.assert(longSpec, value),
  forIdentifier: (value) => Long.isLong(value) ? value : Long.fromInt(value),
  validateForDecoding: (value) => {
    if (!Long.isLong(value)) {
      throw new Error("only decodes google longs");
    }
  }
}
