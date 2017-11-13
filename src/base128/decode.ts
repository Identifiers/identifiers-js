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

const TABLE = new Int8Array(ALPHABET.length << 1).fill(-1);
for (let i = 0; i < ALPHABET.length; i++) {
  TABLE[ALPHABET.charCodeAt(i)] = i;
}

function validateInput(encoded: string): void {

  if (!encoded.endsWith(TERMINATOR)) {
    throw new Error(`Expected '${TERMINATOR}' at end of encoded string: '${encoded}'`);
  }

  // length of 2 means string is terminated OK, but missing chars beforehand
  if (encoded.length === 2) {
    throw new Error(`Encoded string ${encoded} is too short (${encoded.length} chars)`);
  }
}

/**
 * Expects a string value.
 */
export function decode(encoded: string): Uint8Array {

  validateInput(encoded);

  if (encoded === TERMINATOR) {
    return new Uint8Array(0);
  }

  const length = encoded.length - 1;
  const bytesCount = Math.trunc(length * WORD_SIZE / BYTE_SHIFT);
  const fullWords = Math.trunc(bytesCount / WORD_SIZE) * WORD_SIZE;
  const result = new Uint8Array(bytesCount);

  let charPos = 0;
  let bytePos = 0;

  while (bytePos < fullWords) {
    let unpacked = ZERO;

    for (let shift = WORD_SHIFT_START; shift > -1; shift -= WORD_SHIFT) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; shift > -1; shift -= BYTE_SHIFT) {
      unpackIntoResult(unpacked, shift, result, bytePos++);
    }
  }

  // remainder
  if (bytePos < bytesCount) {
    let unpacked = ZERO;

    for (let shift = WORD_SHIFT_START; charPos < length; shift -= WORD_SHIFT) {
      unpacked = unpackChar(encoded, charPos++, unpacked, shift);
    }

    for (let shift = BYTE_SHIFT_START; bytePos < bytesCount; shift -= BYTE_SHIFT) {
      unpackIntoResult(unpacked, shift, result, bytePos++);
    }
  }

  return result;
}


function unpackChar(encoded: string, charPos: number, packed: long, shift: number): long {
  const charCode = encoded.charCodeAt(charPos);
  const value = charCode < TABLE.length ? TABLE[charCode] : -1;
  if (value < 0) {
    throw new Error(`invalid character code: '${charCode}' at position ${charPos}`);
  }
  return packed.or(long.fromInt(value, true).shiftLeft(shift));
}

function unpackIntoResult(unpacked: long, shift: number, result: Uint8Array, bytePos: number): void {
  result[bytePos] = unpacked.shiftRight(shift).low;
}
