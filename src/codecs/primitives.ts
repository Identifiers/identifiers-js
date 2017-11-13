import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";

// todo these codecs need to be documented in the identifiers spec

const asIsCodec = {
  encode: (value) => value,
  decode: (decoded) => decoded
}

export const stringCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "string",
  typeCode: 83, // S
  validateForEncoding: (value) => S.assert(S.spec.string, value),
  validateForDecoding: this.validateForEncoding
}

export const floatCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "float",
  typeCode: 70, // F
  validateForEncoding: (value) => S.assert(S.spec.finite, value),
  validateForDecoding: this.validateForEncoding
}

export const integerCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "integer",
  typeCode: 73, // I
  validateForEncoding: (value) => S.assert(S.spec.integer, value),
  validateForDecoding: this.validateForEncoding
}

export const booleanCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "boolean",
  typeCode: 66, // B
  validateForEncoding: (value) => S.assert(S.spec.boolean, value),
  validateForDecoding: this.validateForEncoding
}

/**
 * Encoded value is the unix/epoch time numerical value.
 */
export const datetimeCodec: IdentifierCodec = {
  type: "datetime",
  typeCode: 68, // D
  validateForEncoding: (value) => S.assert(S.spec.date, value),
  encode: (date: Date) => date.getTime(),
  validateForDecoding: this.validateForEncoding,
  decode: (decoded: number) => new Date(decoded)
}
