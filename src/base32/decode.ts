/*
  This base32 algorithm is based on Mikael Grev's MiGBase64 algorithm: http://migbase64.sourceforge.net
  which is licensed under the BSD Open Source license.
 */
import * as Long from "long";
import {
  BYTE_SHIFT_START,
  BYTE_SIZE,
  CHECK_EXTRAS,
  CHECK_PRIME,
  SYMBOLS,
  WORD_SHIFT_START,
  WORD_SIZE
} from "./constants";
import {
  LONG_BYTES,
  toCharCode,
  TypedObject
} from "../shared";

export const REGEXP = /^[0-9a-tv-z]{2,}[0-9a-z*~$=]$/i;

const BYTE_MASK = 0xff;
const CODES = new Array(0x100);

Array.from(SYMBOLS, toCharCode)
  .forEach((charCode, i) => {
    CODES[charCode] = LONG_BYTES[i];
    const upperCode = toCharCode(String.fromCharCode(charCode).toUpperCase());
    if (charCode !== upperCode) {
      CODES[upperCode] = CODES[charCode];
    }
  });

/**
 * Douglas Crockford's base-32 symbol aliases.
 * @see http://www.crockford.com/wrmg/base32.html
 */
export const DECODE_ALIASES: TypedObject<string[]> = {
  "0": ["o", "O"],
  "1": ["i", "I", "l", "L"]
};

Object.keys(DECODE_ALIASES).forEach((key) => {
  const keyCode = CODES[toCharCode(key)];
  const aliases = DECODE_ALIASES[key];
  aliases.map(toCharCode)
    .forEach((aliasCode) => CODES[aliasCode] = keyCode);
});

const CHECK_CODES = [...CODES];
Array.from(CHECK_EXTRAS, toCharCode)
  .forEach((code, i) => CHECK_CODES[code] = LONG_BYTES[0x20 + i]);

//alias the 'u' to uppercase
CHECK_CODES[toCharCode("U")] = CHECK_CODES[toCharCode("u")];


/**
 * Expects a string value.
 */
export function decode(encoded: string): Uint8Array {
  const length = encoded.length - 1; //skip check digit
  const bytesCount = Math.trunc(length * WORD_SIZE / BYTE_SIZE);
  const fullWordsEnd = Math.trunc(bytesCount / WORD_SIZE) * WORD_SIZE;
  const result = new Uint8Array(bytesCount);

  let charPos = 0;
  let bytePos = 0;
  let checksum = 0;

  while (bytePos < fullWordsEnd) {
    let unpacked = Long.ZERO;

    for (let shift = WORD_SHIFT_START; shift > -1; shift -= WORD_SIZE) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; shift > -1; shift -= BYTE_SIZE) {
      const byte = unpackByte(unpacked, shift);
      result[bytePos++] = byte;
      checksum += byte;
    }
  }

  // remainder
  if (bytePos < bytesCount) {
    let unpacked = Long.ZERO;

    for (let shift = WORD_SHIFT_START; charPos < length; shift -= WORD_SIZE) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; bytePos < bytesCount; shift -= BYTE_SIZE) {
      const byte = unpackByte(unpacked, shift);
      result[bytePos++] = byte;
      checksum += byte;
    }
  }

  checksum %= CHECK_PRIME;
  const checkDigit = encoded.charCodeAt(charPos);
  if (CHECK_CODES[checkDigit].low !== checksum) {
    throw new Error(`Incorrect string -- check digits do not match. Expected: ${CHECK_CODES[checkDigit]}, but calculated ${checksum}`)
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
  return unpacked.shiftRight(shift).low & BYTE_MASK;
}
