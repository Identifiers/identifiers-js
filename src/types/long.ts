import * as S from "js.spec";

import {IdentifierCodec} from "../identifier-codec";
import {integerSpec} from "./integer";
import {exists, isBigInt, isNumber} from "../shared"
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


export type LongInput = number | bigint | LongLike;

/**
 * Encoded type of long. Can be either a number or bigint.
 */
export type EncodedLong = number | bigint;

const TWO_PWR_32_DBL = 1n << 32n;

const longLikeSpec = S.spec.and("long value",
  S.spec.map("long object", {
    high: integerSpec,
    low: integerSpec,
    [S.symbol.optional]: {
      unsigned: S.spec.boolean
    }
  }),
  S.spec.predicate("signed long", (value) => value.unsigned === undefined || !value.unsigned)
);

/*
  Convert a long-like input into a plain object. Must explicitly mask out 'unsigned' as js.spec will fail
  if key is defined, but value is undefined. Maybe remove with specified
 */
function toPlainLongLike({high, low, unsigned}: LongLike): LongLike {
  return exists(unsigned)
    ? {high, low, unsigned}
    : {high, low};
}

function isBigIntLong(value: any) {
  return isBigInt(value) && inLongRange(value);
}

const longInputSpec = S.spec.or("long input", {
  "number": Number.isInteger,
  "bigint": isBigIntLong,
  "LongLike": (value) => S.valid(longLikeSpec, toPlainLongLike(value))
});

const decodeSpec = S.spec.or("decoded long", {
  "number": Number.isInteger,
  "bigint": isBigInt
});

function inLongRange(value: bigint): boolean {
  return value >= -0x8000000000000000n && value <= 0x7fffffffffffffffn;
}

/*
 Convert the input into a bigint.
 */
function forIdentifier(input: LongInput): bigint {
  let long: bigint;
  if (isBigInt(input)) {
    long = input;
  } else if (isNumber(input)) {
    long = BigInt(input);
  } else { // long-like
    long = BigInt(input.high) * TWO_PWR_32_DBL + BigInt(input.low >>> 0);
  }
  return long;
}

function toDebugString(value: bigint): string {
  return value.toString();
}

function decodeValue(encoded: EncodedLong): bigint {
  return isNumber(encoded)
    ? BigInt(encoded)
    : encoded;
}

export const longCodec: IdentifierCodec<LongInput, bigint, EncodedLong> = {
  type: "long",
  typeCode: 0x4,
  specForIdentifier: longInputSpec,
  specForDecoding: decodeSpec,
  forIdentifier: forIdentifier,
  toDebugString: toDebugString,
  encode: asIsCodec.encode,
  decode: decodeValue
};