import * as S from "js.spec";
import * as Long from "long";

import {IdentifierCodec} from "../identifier-codec";
import {integerSpec} from "./integer";
import {exists, isNumber} from "../shared";
import {asIsCodec} from "./shared-types";


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

  /**
   * Unsigned flag. Default is false.
   */
  unsigned?: boolean;
}

export type LongInput = number | LongLike;

/**
 * Encoded type of long. Can be either a number or Long.
 */
export type EncodedLong = number | Long;

const longLikeSpec = S.spec.map("long value", {
  high: integerSpec,
  low: integerSpec,
  [S.symbol.optional]: {
    unsigned: S.spec.boolean
  }
});

/*
  Convert a long-like input into a plain object. Must explicitly mask out 'unsigned' as js.spec will fail
  if key is defined, but value is undefined.
 */
function toPlainLongLike({high, low, unsigned}: LongLike): LongLike {
  return exists(unsigned)
    ? {high, low, unsigned}
    : {high, low};
}

const longInputSpec = S.spec.or("long input", {
  "number": Number.isInteger,
  "Long": Long.isLong,
  "LongLike": (value) => S.valid(longLikeSpec, toPlainLongLike(value))
});

const decodeSpec = S.spec.or("decoded long", {
  "number": integerSpec,
  "Long": Long.isLong
});

/*
 Convert the input into a plain LongLike object, either from number or another LongLike object.
 */
function forIdentifier(input: LongInput): Long {
  let long: Long;
  if (Long.isLong(input)) {
    long = input as Long;
  } else if (isNumber(input)) {
    long = Long.fromNumber(input);
  } else {
    long = Long.fromBits(input.low, input.high, input.unsigned);
  }
  return long.toSigned();
}

function toDebugString(value: Long): string {
  return value.toString();
}

function decodeValue(encoded: EncodedLong): Long {
  return isNumber(encoded)
    ? Long.fromNumber(encoded)
    : encoded.toSigned()
}

export const longCodec: IdentifierCodec<LongInput, Long, EncodedLong> = {
  type: "long",
  typeCode: 0x4,
  specForIdentifier: longInputSpec,
  specForDecoding: decodeSpec,
  forIdentifier: forIdentifier,
  toDebugString: toDebugString,
  encode: asIsCodec.encode,
  decode: decodeValue
};