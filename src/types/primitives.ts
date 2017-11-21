import * as S from "js.spec";
import * as Long from "long";

import {IdentifierCodec} from "../identifier";


export const asIsCodec = {
  forIdentifier: (value) => value,
  encode: (value) => value,
  decode: (value) => value
}

export const anySpec = S.spec.or("any identifier type", {
  "string": S.spec.string,
  "boolean": S.spec.boolean,
  "number": S.spec.number
});

export const anyCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "any",
  typeCode: 0x0,
  validateForIdentifier: (value) => S.assert(anySpec, value),
  validateForDecoding: (value) => S.assert(anySpec, value)
}

export const stringCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "string",
  typeCode: 0x1,
  validateForIdentifier: (value) => S.assert(S.spec.string, value),
  validateForDecoding: (value) => S.assert(S.spec.string, value)
}

export const booleanCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "boolean",
  typeCode: 0x2,
  validateForIdentifier: (value) => S.assert(S.spec.boolean, value),
  validateForDecoding: (value) => S.assert(S.spec.boolean, value)
}


//32-bit signed value
const MIN_INT = -(2 ** 31);
const MAX_INT = 2 ** 31 - 1;
const integerRangeSpec = (value) => value > MIN_INT && value < MAX_INT;
const integerSpec = S.spec.and("integer value",
  S.spec.integer,
  integerRangeSpec);

export const integerCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "integer",
  typeCode: 0x3,
  validateForIdentifier: (value) => S.assert(integerSpec, value),
  validateForDecoding: (value) => S.assert(integerSpec, value)
}


export const floatCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "float",
  typeCode: 0x4,
  validateForIdentifier: (value) => S.assert(S.spec.number, value), // todo change to S.spec.finite when PR is merged
  validateForDecoding: (value) => S.assert(S.spec.number, value)
}


const longSpec = S.spec.or("long", {
  "google long": Long.isLong,
  "integer": S.spec.integer
});

const longDecodeSpec = S.spec.tuple("long decode",
  S.spec.integer,
  S.spec.integer);

export const longCodec: IdentifierCodec = {
  type: "long",
  typeCode: 0x5,
  validateForIdentifier: (value) => S.assert(longSpec, value),
  forIdentifier: (value) => Long.isLong(value) ? value : Long.fromInt(value),
  validateForDecoding: (value) => S.assert(longDecodeSpec, value),
  encode: (value: Long) => [value.low, value.high],
  decode: (value: number[]) => Long.fromBits(value[0], value[1])
}
