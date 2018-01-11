import {
  ALPHABET,
  BYTE_SHIFT,
  BYTE_SHIFT_START,
  PREFIX,
  WORD_SHIFT,
  WORD_SHIFT_START,
  WORD_SIZE,
  ZERO
} from "./constants";
import * as Long from "long";

const CODES = new Array(256).fill(-1);
for (let i = 0; i < ALPHABET.length; i++) {
  CODES[ALPHABET.charCodeAt(i)] = i;
}

function validateInput(encoded: string): void {

  if (!encoded.startsWith(PREFIX)) {
    throw new Error(`Expected '${PREFIX}' at beginning of URI-safe encoded string: '${encoded}'`);
  }

  // length of 2 means string is prefixed OK, but missing chars
  if (encoded.length === 2) {
    throw new Error(`URI-safe encoded string ${encoded} is too short (${encoded.length} chars)`);
  }
}

/**
 * Expects a string value.
 */
export function decode(encoded: string): Uint8Array {

  validateInput(encoded);

  if (encoded === PREFIX) {
    return new Uint8Array(0);
  }

  const length = encoded.length - 1; //skip prefix
  const bytesCount = Math.trunc(length * WORD_SIZE / BYTE_SHIFT);
  const fullWordsEnd = Math.trunc(bytesCount / WORD_SIZE) * WORD_SIZE;
  const result = new Uint8Array(bytesCount);

  let charPos = 1;  //skip the prefix
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

    for (let shift = WORD_SHIFT_START; charPos <= length; shift -= WORD_SHIFT) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; bytePos < bytesCount; shift -= BYTE_SHIFT) {
      result[bytePos++] = unpackByte(unpacked, shift);
    }
  }

  return result;
}


function unpackChar(encoded: string, charPos: number, unpacked: Long, shift: number): Long {
  const charCode = encoded.charCodeAt(charPos);
  const value = charCode < CODES.length ? CODES[charCode] : -1;
  if (value < 0) {
    throw new Error(`invalid character code: '${charCode}' at position ${charPos}`);
  }
  return unpacked.or(Long.fromInt(value, true).shiftLeft(shift));
}

function unpackByte(unpacked: Long, shift: number): number {
  return unpacked.shiftRight(shift).low;
}
