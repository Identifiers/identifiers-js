import * as S from "js.spec";
import * as Long from "long";

import {IdentifierCodec} from "../identifier";

// todo these codecs need to be documented in the identifiers spec

const asIsCodec = {
  forIdentifier: (value) => value,
  encode: (value) => value,
  decode: (value) => value
}


function validateAny(value: any): void {
  if (   value === undefined
      || S.spec.fn(value)
      || S.spec.symbol(value)) {
    throw new Error("identifier values must not be undefined, functions or symbols");
  }
}

export const anyCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "any",
  typeCode: 0,
  validateForIdentifier: validateAny,
  validateForDecoding: validateAny
}

export const stringCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "string",
  typeCode: 1,
  validateForIdentifier: (value) => S.assert(S.spec.string, value),
  validateForDecoding: (value) => S.assert(S.spec.string, value)
}

export const booleanCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "boolean",
  typeCode: 2,
  validateForIdentifier: (value) => S.assert(S.spec.boolean, value),
  validateForDecoding: (value) => S.assert(S.spec.boolean, value)
}

export const integerCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "integer",
  typeCode: 3,
  //todo how many bytes should this integer be? I think we will need unsigned too?
  validateForIdentifier: (value) => S.assert(S.spec.integer, value), //todo does this work for a 32-bit integer?
  validateForDecoding: (value) => S.assert(S.spec.integer, value)
}

export const floatCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "float",
  typeCode: 4,
  validateForIdentifier: (value) => S.assert(S.spec.number, value), // todo change to S.spec.finite when PR is merged
  validateForDecoding: (value) => S.assert(S.spec.number, value)
}

const longSpec = S.spec.or("long", {
  "google long": Long.isLong,
  "integer": S.spec.integer
});
export const longCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "long",
  typeCode: 5,
  validateForIdentifier: (value) => S.assert(longSpec, value),
  forIdentifier: (value) => Long.isLong(value) ? value : Long.fromInt(value),
  validateForDecoding: (value) => {
    if (!Long.isLong(value)) {
      throw new Error("only decodes google longs");
    }
  }
}

//todo JS double. Perhaps Google has one of these I can extract?
export const doubleCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "double",
  typeCode: 6,
  validateForIdentifier: (value) => S.assert(S.spec.number, value),
  validateForDecoding: (value) => S.assert(S.spec.number, value)
}
