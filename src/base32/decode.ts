import * as Long from "long";
import {
  toCharCode,
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

export const REGEXP = /_[0-9A-VW-Za-vw-z]{2,}[0-9A-Za-z*~$=]/;

const CODES = new Array(256).fill(-1);
Array.from(SYMBOLS, toCharCode)
  .forEach((charCode, i) => {
    CODES[charCode] = i;
    const upperCode = toCharCode(String.fromCharCode(charCode).toUpperCase());
    if (charCode != upperCode) {
      CODES[upperCode] = i;
    }
  });

/**
 * Douglas Crockford's base-32 symbol aliases.
 * @see http://www.crockford.com/wrmg/base32.html
 */
export const DECODE_ALIASES = {
  "0": ["o", "O"],
  "1": ["i", "I", "l", "L"]
};

for (const key in DECODE_ALIASES) {
  const keyCode = CODES[toCharCode(key)];
  const aliases = DECODE_ALIASES[key];
  aliases.map(toCharCode)
    .forEach((aliasCode) => CODES[aliasCode] = keyCode);
}

const CHECK_CODES = [...CODES];
Array.from(CHECK_EXTRAS, toCharCode)
  .forEach((code, i) => CHECK_CODES[code] = 32 + i);

//alias the 'u'
CHECK_CODES[toCharCode("U")] = CHECK_CODES[toCharCode("u")];


//faster than a full regex test
export function maybe(encoded: string): boolean {
  return encoded.length != 3 && encoded.startsWith(PREFIX);
}

/**
 * Expects a string value.
 */
export function decode(encoded: string): Uint8Array {
  if (encoded === PREFIX) {
    return new Uint8Array(0);
  }

  const length = encoded.length - 2; //skip prefix, check digit
  const bytesCount = Math.trunc(length * WORD_SIZE / BYTE_SHIFT);
  const fullWordsEnd = Math.trunc(bytesCount / WORD_SIZE) * WORD_SIZE;
  const result = new Uint8Array(bytesCount);

  let charPos = 1;  //skip the prefix
  let bytePos = 0;
  let checksum = 0;

  while (bytePos < fullWordsEnd) {
    let unpacked = ZERO;

    for (let shift = WORD_SHIFT_START; shift > -1; shift -= WORD_SHIFT) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; shift > -1; shift -= BYTE_SHIFT) {
      const byte = unpackByte(unpacked, shift);
      result[bytePos++] = byte;
      checksum += byte;
    }
  }

  // remainder
  if (bytePos < bytesCount) {
    let unpacked = ZERO;

    for (let shift = WORD_SHIFT_START; charPos <= length; shift -= WORD_SHIFT) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; bytePos < bytesCount; shift -= BYTE_SHIFT) {
      const byte = unpackByte(unpacked, shift);
      result[bytePos++] = byte;
      checksum += byte;
    }
  }

  checksum %= CHECK_PRIME;
  const checkDigit = encoded.charCodeAt(charPos);
  if (CHECK_CODES[checkDigit] != checksum) {
    throw new Error(`Incorrect string -- check digits do not match. Expected: ${CHECK_CODES[checkDigit]}, but calculated ${checksum}`)
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
  return unpacked.shiftRight(shift).low & BYTE_MASK;
}
