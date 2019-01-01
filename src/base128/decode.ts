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

export const REGEXP = /^[/-9?-Za-z¿-ý]{2,}$/;

const CODES: Long[] = new Array(0x100);
Array.from(SYMBOLS, toCharCode)
  .forEach((code, i) => CODES[code] = LONG_BYTES[i]);


/**
 * Expects a non-empty string value.
 */
export function decode(encoded: string): Uint8Array {
  const length = encoded.length;
  const bytesCount = Math.trunc(length * WORD_SIZE / BYTE_SIZE);
  const fullWordsEnd = Math.trunc(bytesCount / WORD_SIZE) * WORD_SIZE;
  const result = new Uint8Array(bytesCount);

  let charPos = 0;
  let bytePos = 0;

  while (bytePos < fullWordsEnd) {
    let unpacked = Long.ZERO;

    for (let shift = WORD_SHIFT_START; shift > -1; shift -= WORD_SIZE) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; shift > -1; shift -= BYTE_SIZE) {
      result[bytePos++] = unpackByte(unpacked, shift);
    }
  }

  // remainder
  if (bytePos < bytesCount) {
    let unpacked = Long.ZERO;

    for (let shift = WORD_SHIFT_START; charPos < length; shift -= WORD_SIZE) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; bytePos < bytesCount; shift -= BYTE_SIZE) {
      result[bytePos++] = unpackByte(unpacked, shift);
    }
  }

  return result;
}


function unpackChar(encoded: string, charPos: number, unpacked: Long, shift: number): Long {
  const charCode = encoded.charCodeAt(charPos);
  const value = CODES[charCode];
  if (!value) {
    throw new Error(`invalid character code: '${charCode}' at position ${charPos}`);
  }
  return unpacked.or(value.shiftLeft(shift));
}

function unpackByte(unpacked: Long, shift: number): number {
  return unpacked.shiftRight(shift).low;
}
