import * as long from "long";
import {
  ALPHABET,
  BYTE_SHIFT,
  BYTE_SHIFT_START,
  TERMINATOR,
  WORD_SHIFT,
  WORD_SHIFT_START,
  WORD_SIZE,
  ZERO
} from "./constants";

const BYTE_SIGN_MASK = 0xff;
const BITS_MASK = 0x7f;
const TERMINATOR_CODE = TERMINATOR.charCodeAt(0);
const CODES: number[] = new Array(ALPHABET.length);

for (let i = 0; i < ALPHABET.length; i++) {
  CODES[i] = ALPHABET.charCodeAt(i);
}


export function encode(unencoded: Uint8Array): string {

  if (unencoded.length === 0) {
    return TERMINATOR;
  }

  const wordCount = unencoded.length / WORD_SIZE;
  const charCount = Math.ceil(wordCount * BYTE_SHIFT) + 1;
  const fullWords = Math.trunc(wordCount) * WORD_SIZE;
  const result = new Array(charCount);

  let charPos = 0;
  let bytePos = 0;

  while (bytePos < fullWords) {
    let packed = ZERO;

    for (let shift = BYTE_SHIFT_START; shift > -1; shift -= BYTE_SHIFT) {
      packed = packByte(unencoded, bytePos++, packed, shift);
    }

    for (let shift = WORD_SHIFT_START; shift > -1; shift -= WORD_SHIFT) {
      packIntoResult(packed, shift, result, charPos++);
    }
  }

  // remainder
  if (bytePos < unencoded.length) {
    let packed = ZERO;

    for (let shift = BYTE_SHIFT_START; bytePos < unencoded.length; shift -= BYTE_SHIFT) {
      packed = packByte(unencoded, bytePos++, packed, shift);
    }

    let remainder = unencoded.length - fullWords;
    for (let shift = WORD_SHIFT_START; remainder > -1; remainder--) {
      packIntoResult(packed, shift, result, charPos++);
      shift -= WORD_SHIFT;
    }
  }

  result[charPos] = TERMINATOR_CODE;
  return String.fromCharCode(...result);
}

function packByte(unencoded: Uint8Array, pos: number, packed: long, shift: number): long {
  return packed.or(long.fromInt(unencoded[pos] & BYTE_SIGN_MASK, true).shiftLeft(shift));
}

function packIntoResult(packed: long, shift: number, result: number[], pos: number): void {
  result[pos] = CODES[packed.shiftRight(shift).low & BITS_MASK];
}
