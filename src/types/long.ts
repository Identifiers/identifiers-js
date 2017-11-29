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
  high: number;

  /**
   * The low 32 bits as a signed value.
   */
  low: number;
}


const longArraySpec = S.spec.tuple("long decode",
  integerSpec,
  integerSpec);

// forgiving of other fields in the object; js.spec can't be forgiving like this
function longLikeSpec({low, high}): boolean {
  return S.valid(longArraySpec, [low, high]);
};

const identifierSpec = S.spec.or("long", {
  "LongLike": longLikeSpec,
  "integer": Number.isInteger
});

const decodeSpec = S.spec.or("decoded long", {
  "number": integerSpec,
  "Int64BE": Int64BE.isInt64BE
});

function createIdentifierValue(value): LongLike {
  if (typeof value === 'number') {
    const long = Long.fromNumber(value);
    return {high: long.high, low: long.low};
  }
  return value;
}

function readDecoded(value: Int64BE | number) {
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
  // if number is a 32-bit int value then just use number so msgpack will store as int32
  // over that size use long. Basically that means if high != 0.
  encode: ({low, high}) => high === 0 ? low : new Int64BE(high, low),
  decode: (value) => Int64BE.isInt64BE(value) ? readLong(value) : {high: 0, low: value}
}

export const longListCodec: IdentifierCodec = createListCodec(longCodec, identifierSpec, decodeSpec);