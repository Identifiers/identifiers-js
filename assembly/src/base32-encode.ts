import {
  BYTE_SHIFT_START,
  BYTE_SIZE,
  CHECK_EXTRAS, CHECK_PRIME,
  SYMBOLS,
  WORD_SHIFT_START,
  WORD_SIZE
} from "../../src/base32/constants"

const BITS_MASK = 0x1f;
const CODES = new Array<i32>(SYMBOLS.length);
for (let i = SYMBOLS.length - 1; i > -1; i--) {
  CODES[i] = SYMBOLS.charCodeAt(i);
}
const CE = new Array<i32>(CHECK_EXTRAS.length);
for (let i = CHECK_EXTRAS.length - 1; i > -1; i--) {
  CE[i] = CHECK_EXTRAS.charCodeAt(i);
}
const CHECK_CODES = CODES.concat(CE);


export function encode(unencoded: Uint8Array): Int8Array {
  const wordCount = unencoded.length / WORD_SIZE;
  const charCount = Math.ceil(wordCount * BYTE_SIZE as f64) + 1 as i32; // + 1 is check digit
  const fullWordsEnd = Math.trunc(wordCount) * WORD_SIZE;
  const result = new Int8Array(charCount);

  let charPos = 0;
  let bytePos = 0;
  let checksum = 0;

  while (bytePos < fullWordsEnd) {
    let packed: i64 = 0;

    for (let shift = BYTE_SHIFT_START; shift > -1; shift -= BYTE_SIZE) {
      const byte = unencoded[bytePos++];
      packed = packByte(byte, packed, shift);
      checksum += byte;
    }

    for (let shift = WORD_SHIFT_START; shift > -1; shift -= WORD_SIZE) {
      result[charPos++] = packChar(packed, shift);
    }
  }

  // remainder
  if (bytePos < unencoded.length) {
    let packed: i64 = 0;
    for (let shift = BYTE_SHIFT_START; bytePos < unencoded.length; shift -= BYTE_SIZE) {
      const byte = unencoded[bytePos++];
      packed = packByte(byte, packed, shift);
      checksum += byte;
    }

    // this is different from Base128 because it is possible to have more than one symbol in a byte.
    let remainder = unencoded.length - fullWordsEnd;
    let shift = WORD_SHIFT_START;

    result[charPos++] = packChar(packed, shift);
    result[charPos++] = packChar(packed, shift -= WORD_SIZE);

    if (remainder > 1) {
      result[charPos++] = packChar(packed, shift -= WORD_SIZE);
      result[charPos++] = packChar(packed, shift -= WORD_SIZE);
    }

    if (remainder > 2) {
      result[charPos++] = packChar(packed, shift -= WORD_SIZE);
    }

    if (remainder > 3) {
      result[charPos++] = packChar(packed, shift - WORD_SIZE);
      result[charPos++] = packChar(packed, WORD_SIZE);
    }
  }

  result[charPos] = CHECK_CODES[checksum % CHECK_PRIME];

  return result;
}

function packByte(byte: u8, packed: i64, shift: i32): i64 {
  return packed | (byte as i32) << shift;
}

function packChar(packed: i64, shift: i32): i32 {
  return CODES[(packed >> shift & BITS_MASK) as i32];
}