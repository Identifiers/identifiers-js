import * as S from "js.spec";
import {Int64BE} from "int64-buffer";
import * as Long from "long";

import {IdentifierCodec} from "../identifier";
import {createListCodec} from "./lists";
import {integerSpec} from "./integer";
import {existsPredicate} from "../shared";

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
  high: integerSpec,
  low: integerSpec,
  [S.symbol.optional]: {
    unsigned: S.spec.and("unsigned flag should be false",
      S.spec.boolean,
      (value) => !!!value
    )
  }
});

// spec map [optional] will assert if key exists, but value is undefined
function toLongLike({high, low, unsigned}) {
  return existsPredicate(unsigned)
    ? {high, low, unsigned}
    : {high, low};
}

const longInputSpec = S.spec.or("long input", {
  "number": Number.isInteger,
  "LongLike": (value) => S.valid(longLikeSpec, toLongLike(value))
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
  return {high: long.high, low: long.low};
}

/*
  If number is a 32-bit int value (high != 0) then just use number so msgpack will store as int32
  If over that size use Int64BE
*/
function encodeValue({high, low}) {
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
  return {
    high: (array[0] << 24) | (array[1] << 16) | (array[2] << 8) | array[3],
    low: (array[4] << 24) | (array[5] << 16) | (array[6] << 8) | array[7]
  };
}

export const longCodec: IdentifierCodec = {
  type: "long",
  typeCode: 0x5,
  validateForIdentifier: (value) => S.assert(longInputSpec, value),
  forIdentifier: createIdentifierValue,
  validateForDecoding: (value) => S.assert(decodeSpec, value),
  encode: encodeValue,
  decode: decodeValue
}

export const longListCodec: IdentifierCodec = createListCodec(longCodec, longInputSpec, decodeSpec);