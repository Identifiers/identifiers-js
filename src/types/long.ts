import * as S from "js.spec";
import * as Long from "long";
import {IdentifierCodec} from "../identifier";
import {createListCodec} from "./lists";

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

export const longListCodec: IdentifierCodec = createListCodec(longCodec, longSpec, longDecodeSpec);