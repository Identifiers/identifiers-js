import {
  BYTE_SHIFT,
  BYTE_SHIFT_START,
  PREFIX,
  SYMBOLS,
  WORD_SHIFT,
  WORD_SHIFT_START,
  WORD_SIZE,
  ZERO
} from "./constants";
import * as Long from "long";

//regex contains the decode alias symbols too
export const REGEXP = /_[0-9A-VW-Za-vw-z]{2,}/;

const CODES = new Array(256).fill(-1);
for (let i = 0; i < SYMBOLS.length; i++) {
  const charCode = SYMBOLS.charCodeAt(i);
  CODES[charCode] = i;
  const upperCode = String.fromCharCode(charCode).toUpperCase().charCodeAt(0);
  if (charCode != upperCode) {
    CODES[upperCode] = i;
  }
}

/**
 * Douglas Crockford's base-32 symbol aliases.
 * @see http://www.crockford.com/wrmg/base32.html
 */
export const DECODE_ALIASES = {
  "0": ["o", "O"],
  "1": ["i", "I", "l", "L"]
};

for (const key in DECODE_ALIASES) {
  const keyCode = CODES[key.charCodeAt(0)];
  const aliases = DECODE_ALIASES[key];
  for (const alias of aliases) {
    const aliasCode = alias.charCodeAt(0);
    CODES[aliasCode] = keyCode;
  }
}

//faster than a full regex test
export function maybe(encoded: string): boolean {
  return encoded.length != 2 && encoded.startsWith(PREFIX);
}

/**
 * Expects a string value.
 */
export function decode(encoded: string): Uint8Array {
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
