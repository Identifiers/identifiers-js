import * as S from "js.spec";
import {Int64BE} from "int64-buffer";
import * as Long from "long";

import {IdentifierCodec} from "../identifier";
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

export type LongLikeWithUnsigned = LongLike & {
  unsigned?: boolean
};

/**
 * Input type for long identifier that takes either a number or a LongLike object. Some Long-like objects
 * have an unsigned field.
 */
export type LongInput = number | LongLikeWithUnsigned;

/**
 * Encoded type of long. Can be either a number or a byte array
 */
export type EncodedLong = Int64BE | number;

const longLikeSpec = S.spec.map("long value", {
  high: integerSpec,
  low: integerSpec,
  [S.symbol.optional]: {
    unsigned: S.spec.and("unsigned flag should be false",
      S.spec.boolean,
      S.spec.predicate("not true", (value) => !!!value))
  }
});

/*
  Convert a long-like input into a plain object. Must explicitly mask out 'unsigned' as js.spec will fail
  if key is defined, but value is undefined.
 */
function toPlainLongLike({high, low, unsigned}: LongLikeWithUnsigned): LongLikeWithUnsigned {
  return existsPredicate(unsigned)
    ? {high, low, unsigned}
    : {high, low};
}

const longInputSpec = S.spec.or("long input", {
  "number": Number.isInteger,
  "LongLike": (value) => S.valid(longLikeSpec, toPlainLongLike(value))
});

const decodeSpec = S.spec.or("decoded long", {
  "number": integerSpec,
  "Int64BE": Int64BE.isInt64BE
});

function isLongLike(input: LongInput): input is LongLike {
  return typeof input === "object";
}

/*
 Convert the input into a plain LongLike object, either from number or another LongLike object.
 */
function forIdentifierValue(input: LongInput): LongLike {
  if (isLongLike(input)) {
    return {high: input.high, low: input.low};
  }
  const long = Long.fromNumber(input);
  return {high: long.high, low: long.low};
}

/*
  If number is a 32-bit int value (high != 0) then just use number so msgpack will store as int32
  If over that size use Int64BE
*/
function encodeValue({high, low}: LongLike): EncodedLong {
  return high === 0
    ? low
    : new Int64BE(high, low);
}

function decodeValue(encoded: EncodedLong): LongLike {
  return Int64BE.isInt64BE(encoded)
    ? readLong(encoded)
    : {high: 0, low: encoded}
}

function readLong(encoded: Int64BE): LongLike {
  const array = encoded.toArray(true);
  return {
    high: (array[0] << 24) | (array[1] << 16) | (array[2] << 8) | array[3],
    low: (array[4] << 24) | (array[5] << 16) | (array[6] << 8) | array[7]
  };
}

export const longCodec: IdentifierCodec<LongInput, LongLike, EncodedLong> = {
  type: "long",
  typeCode: 0x4,
  specForIdentifier: longInputSpec,
  forIdentifier: forIdentifierValue,
  encode: encodeValue,
  specForDecoding: decodeSpec,
  decode: decodeValue
};