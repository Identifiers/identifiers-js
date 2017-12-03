import * as S from "js.spec";
import {Int64BE} from "int64-buffer";
import * as Long from "long";

import {IdentifierCodec} from "../identifier";
import {createListCodec} from "./lists";
import {integerSpec} from "./integer";

/**
 * 64 bit two's-complement integer, given its low and high 32 bit values as signed integers. Looks like a
 * Google Closure Long:
 * https://google.github.io/closure-library/api/goog.math.Long.html
 * https://github.com/google/closure-library/blob/master/closure/goog/math/long.js
 */
export interface LongLike {
  /**
   * The high 32 bits as a signed value.
   */
  readonly high: number;

  /**
   * The low 32 bits as a signed value.
   */
  readonly low: number;
}

/**
 * Input type for long identifier that takes either a number or a LongLike object.
 */
export type LongInput = number | LongLike;


export const longLikeSpec = S.spec.map("long value", {
  low: integerSpec,
  high: integerSpec,
  [S.symbol.optional]: {
    unsigned: S.spec.and("unsigned flag should be false",
      S.spec.boolean,
      (value) => !!value)
  }
});

const identifierSpec = S.spec.or("long identifier", {
  "number": Number.isInteger,
  "LongLike": longLikeSpec
});

const decodeSpec = S.spec.or("decoded long", {
  "number": integerSpec,
  "Int64BE": Int64BE.isInt64BE
});

function createIdentifierValue(value): LongLike {
  let long = value;
  if (typeof value === 'number') {
    long = Long.fromNumber(value);
  }
  const {high, low} = long;
  return {high, low};
}

/*
  If number is a 32-bit int value (high != 0) then just use number so msgpack will store as int32
  If over that size use Int64BE
*/
function encodeValue({low, high}) {
  return high === 0
    ? low
    : new Int64BE(high, low);
}

function decodeValue(value: Int64BE | number): LongLike {
  return Int64BE.isInt64BE(value)
    ? readLong(value)
    : {high: 0, low: value}
}

function readLong(value: Int64BE): LongLike {
  const array = value.toArray(true);
  const hi = (array[0] << 24) | (array[1] << 16) | (array[2] << 8) | array[3];
  const lo = (array[4] << 24) | (array[5] << 16) | (array[6] << 8) | array[7];
  return {high: hi, low: lo};
}

export const longCodec: IdentifierCodec = {
  type: "long",
  typeCode: 0x5,
  validateForIdentifier: (value) => S.assert(identifierSpec, value),
  forIdentifier: createIdentifierValue,
  validateForDecoding: (value) => S.assert(decodeSpec, value),
  encode: encodeValue,
  decode: decodeValue
}

export const longListCodec: IdentifierCodec = createListCodec(longCodec, identifierSpec, decodeSpec);