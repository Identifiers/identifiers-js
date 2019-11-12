/*
  This base128 algorithm is based on Mikael Grev's MiGBase64 algorithm: http://migbase64.sourceforge.net
  which is licensed under the BSD Open Source license.
 */
import * as Long from "long";
import {
  BYTE_SHIFT_START,
  BYTE_SIZE,
  SYMBOLS,
  WORD_SHIFT_START,
  WORD_SIZE
} from "./constants";
import {
  LONG_BYTES,
  toCharCode
} from "../shared";

const BITS_MASK = 0x7f;
const CODES = Array.from(SYMBOLS, toCharCode);


export function encode(unencoded: Uint8Array): string {
  const wordCount = unencoded.length / WORD_SIZE;
  const charCount = Math.ceil(wordCount * BYTE_SIZE);
  const fullWordsEnd = Math.trunc(wordCount) * WORD_SIZE;
  const result = new Array(charCount);

  let charPos = 0;
  let bytePos = 0;

  while (bytePos < fullWordsEnd) {
    let packed = Long.ZERO;

    for (let shift = BYTE_SHIFT_START; shift > -1; shift -= BYTE_SIZE) {
      packed = packByte(unencoded[bytePos++], packed, shift);
    }

    for (let shift = WORD_SHIFT_START; shift > -1; shift -= WORD_SIZE) {
      result[charPos++] = packChar(packed, shift);
    }
  }

  // remainder
  if (bytePos < unencoded.length) {
    let packed = Long.ZERO;

    for (let shift = BYTE_SHIFT_START; bytePos < unencoded.length; shift -= BYTE_SIZE) {
      packed = packByte(unencoded[bytePos++], packed, shift);
    }

    let remainder = unencoded.length - fullWordsEnd;
    for (let shift = WORD_SHIFT_START; remainder > -1; shift -= WORD_SIZE) {
      result[charPos++] = packChar(packed, shift);
      --remainder;
    }
  }

  return String.fromCharCode(...result);
}

function packByte(byte: number, packed: Long, shift: number): Long {
  return packed.or(LONG_BYTES[byte].shiftLeft(shift));
}

function packChar(packed: Long, shift: number): number {
  return CODES[packed.shiftRight(shift).low & BITS_MASK];
}
