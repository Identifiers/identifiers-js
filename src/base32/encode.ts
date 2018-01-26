import * as Long from "long";
import {
  BYTE_MASK,
  BYTE_SHIFT,
  BYTE_SHIFT_START,
  CHECK_EXTRAS,
  CHECK_PRIME,
  PREFIX,
  SYMBOLS,
  WORD_SHIFT,
  WORD_SHIFT_START,
  WORD_SIZE,
  ZERO
} from "./constants";

const BITS_MASK = 0x1f;
const PREFIX_CODE = PREFIX.charCodeAt(0);
const CODES = new Array(SYMBOLS.length);

for (let i = 0; i < SYMBOLS.length; i++) {
  CODES[i] = SYMBOLS.charCodeAt(i);
}

const CHECK_CODES = [...CODES];
for (let i = 0; i < CHECK_EXTRAS.length; i++) {
  CHECK_CODES.push(CHECK_EXTRAS.charCodeAt(i));
}

export function encode(unencoded: Uint8Array): string {

  if (unencoded.length === 0) {
    return PREFIX;
  }

  const wordCount = unencoded.length / WORD_SIZE;
  const charCount = Math.ceil(wordCount * BYTE_SHIFT) + 2; // + 2 is prefix, checkChar
  const fullWordsEnd = Math.trunc(wordCount) * WORD_SIZE;
  const result = new Array(charCount);

  result[0] = PREFIX_CODE;

  let charPos = 1;
  let bytePos = 0;
  let checksum = 0;

  while (bytePos < fullWordsEnd) {
    let packed = ZERO;

    for (let shift = BYTE_SHIFT_START; shift > -1; shift -= BYTE_SHIFT) {
      checksum += unencoded[bytePos];
      packed = packByte(unencoded[bytePos++], packed, shift);
    }

    for (let shift = WORD_SHIFT_START; shift > -1; shift -= WORD_SHIFT) {
      result[charPos++] = packChar(packed, shift);
    }
  }

  // remainder
  if (bytePos < unencoded.length) {
    let packed = ZERO;
    for (let shift = BYTE_SHIFT_START; bytePos < unencoded.length; shift -= BYTE_SHIFT) {
      checksum += unencoded[bytePos];
      packed = packByte(unencoded[bytePos++], packed, shift);
    }

    // this is different from Base128 because it is possible to have more than one symbol in a byte.
    let remainder = unencoded.length - fullWordsEnd;
    let shift = WORD_SHIFT_START;

    result[charPos++] = packChar(packed, shift);
    result[charPos++] = packChar(packed, shift -= WORD_SHIFT);

    if (remainder > 1) {
      result[charPos++] = packChar(packed, shift -= WORD_SHIFT);
      result[charPos++] = packChar(packed, shift -= WORD_SHIFT);
    }

    if (remainder > 2) {
      result[charPos++] = packChar(packed, shift -= WORD_SHIFT);
    }

    if (remainder > 3) {
      result[charPos++] = packChar(packed, shift -= WORD_SHIFT);
      result[charPos++] = packChar(packed, WORD_SIZE);
    }
  }

  result[charPos] = CHECK_CODES[checksum % CHECK_PRIME];

  return String.fromCharCode(...result);
}

function packByte(byte: number, packed: Long, shift: number): Long {
  return packed.or(Long.fromInt(byte & BYTE_MASK, true).shiftLeft(shift));
}

function packChar(packed: Long, shift: number): number {
  return CODES[packed.shiftRight(shift).low & BITS_MASK];
}