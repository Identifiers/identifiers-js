import * as long from "long";
import {
  BYTE_SHIFT,
  BYTE_SHIFT_START,
  SYMBOLS,
  TERMINATOR,
  WORD_SHIFT,
  WORD_SHIFT_START,
  WORD_SIZE,
  ZERO
} from "./constants";

export const REGEXP = /[/-9?-Za-z¿-ý]{2,}þ/;

const CODES = new Array(256).fill(-1);
for (let i = 0; i < SYMBOLS.length; i++) {
  CODES[SYMBOLS.charCodeAt(i)] = i;
}

//faster than a full regex test
export function maybe(encoded: string): boolean {
  return encoded.length != 2 && encoded.endsWith(TERMINATOR);
}

/**
 * Expects a string value.
 */
export function decode(encoded: string): Uint8Array {
  if (encoded === TERMINATOR) {
    return new Uint8Array(0);
  }

  const length = encoded.length - 1;
  const bytesCount = Math.trunc(length * WORD_SIZE / BYTE_SHIFT);
  const fullWordsEnd = Math.trunc(bytesCount / WORD_SIZE) * WORD_SIZE;
  const result = new Uint8Array(bytesCount);

  let charPos = 0;
  let bytePos = 0;

  while (bytePos < fullWordsEnd) {
    let unpacked = ZERO;

    for (let shift = WORD_SHIFT_START; shift > -1; shift -= WORD_SHIFT) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; shift > -1; shift -= BYTE_SHIFT) {
      result[bytePos++] = unpackByte(unpacked, shift);
    }
  }

  // remainder
  if (bytePos < bytesCount) {
    let unpacked = ZERO;

    for (let shift = WORD_SHIFT_START; charPos < length; shift -= WORD_SHIFT) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; bytePos < bytesCount; shift -= BYTE_SHIFT) {
      result[bytePos++] = unpackByte(unpacked, shift);
    }
  }

  return result;
}


function unpackChar(encoded: string, charPos: number, unpacked: long, shift: number): long {
  const charCode = encoded.charCodeAt(charPos);
  const value = charCode < CODES.length ? CODES[charCode] : -1;
  if (value < 0) {
    throw new Error(`invalid character code: '${charCode}' at position ${charPos}`);
  }
  return unpacked.or(long.fromInt(value, true).shiftLeft(shift));
}

function unpackByte(unpacked: long, shift: number): number {
  return unpacked.shiftRight(shift).low;
}
