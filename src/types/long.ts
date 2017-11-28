import * as S from "js.spec";
import * as Long from "long";

import {IdentifierCodec} from "../identifier";
import {createListCodec} from "./lists";
import {integerSpec} from "./integer";

/**
 * 64 bit two's-complement integer, given its low and high 32 bit values as signed integers. Looks like a
 * Google Closure Long: https://github.com/google/closure-library/blob/master/closure/goog/math/long.js
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

function longLikeSpec({low, high}): boolean {
  return S.valid(longArraySpec, [low, high])
};

const longSpec = S.spec.or("long", {
  "LongLike": longLikeSpec,
  "integer": S.spec.integer
});


// todo look at how you can create a MsgPack long instead of 2-int array
const longArraySpec = S.spec.tuple("long decode",
  integerSpec,
  integerSpec);

export const longCodec: IdentifierCodec = {
  type: "long",
  typeCode: 0x5,

  validateForIdentifier: (value) => S.assert(longSpec, value),
  forIdentifier: (value) => Number.isInteger(value) ? Long.fromInt(value) : value,
  validateForDecoding: (value) => S.assert(longArraySpec, value),
  encode: (value: LongLike) => [value.low, value.high],
  decode: ([lo, hi]) => ({low: lo, high: hi})
}

export const longListCodec: IdentifierCodec = createListCodec(longCodec, longSpec, longArraySpec);