/*
  This base128 algorithm is based on Mikael Grev's MiGBase64 algorithm: http://migbase64.sourceforge.net
  which is licensed under the BSD Open Source license.
 */
import {
  BYTE_SHIFT_START,
  BYTE_SIZE,
  BYTE_SIZE_N,
  SYMBOLS,
  WORD_SHIFT_START,
  WORD_SIZE,
  WORD_SIZE_N
} from "./constants"
import {toCharCode} from "../shared";

export const REGEXP = /^[/-9?-Za-z¿-ý]{2,}$/;

const CODES: bigint[] = new Array(0x100);
Array.from(SYMBOLS, toCharCode)
  .forEach((code, i) => CODES[code] = BigInt(i));


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
    let unpacked = 0n;

    for (let shift = WORD_SHIFT_START; shift > -1; shift -= WORD_SIZE_N) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; shift > -1; shift -= BYTE_SIZE_N) {
      result[bytePos++] = unpackByte(unpacked, shift);
    }
  }

  // remainder
  if (bytePos < bytesCount) {
    let unpacked = 0n;

    for (let shift = WORD_SHIFT_START; charPos < length; shift -= WORD_SIZE_N) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; bytePos < bytesCount; shift -= BYTE_SIZE_N) {
      result[bytePos++] = unpackByte(unpacked, shift);
    }
  }

  return result;
}


function unpackChar(encoded: string, charPos: number, unpacked: bigint, shift: bigint): bigint {
  const charCode = encoded.charCodeAt(charPos);
  const value = CODES[charCode];
  if (value === undefined) {
    throw new Error(`invalid character code: '${encoded[charPos]}' (${charCode}) at position ${charPos}`);
  }
  return unpacked | value << shift;
}

function unpackByte(unpacked: bigint, shift: bigint): number {
  return Number(unpacked >> shift & 0xffn);
}
