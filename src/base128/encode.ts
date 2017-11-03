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

const BYTE_SIGN_MASK = 0xff;
const BITS_MASK = 0x7f;
const TERMINATOR_CODE = TERMINATOR.charCodeAt(0);
const CODES: Array<number> = [];

for (let i = 0; i < ALPHABET.length; i++) {
  CODES[i] = ALPHABET.charCodeAt(i);
}

function validateInput(unencoded: Uint8Array): void {
  if (!unencoded || !(unencoded instanceof Uint8Array)) {
    throw new Error(`Cannot encode ${unencoded}`);
  }
}

export function encode(unencoded: Uint8Array): string {
  validateInput(unencoded);

  if (unencoded.length === 0) {
    return TERMINATOR;
  }

  const result: Array<number> = [];
  const wordsEnd = Math.trunc(unencoded.length / WORD_SIZE) * WORD_SIZE;

  let pos = 0;
  while (pos < wordsEnd) {
    let packed = ZERO;

    for (let shift = BYTE_SHIFT_START; shift > -1; shift -= BYTE_SHIFT) {
      packed = packByte(unencoded, pos++, packed, shift);
    }

    for (let shift = WORD_SHIFT_START; shift > -1; shift -= WORD_SHIFT) {
      packIntoResult(packed, shift, result);
    }
  }

  // remainder
  if (pos < unencoded.length) {
    let packed = ZERO;

    for (let shift = BYTE_SHIFT_START; pos < unencoded.length; shift -= BYTE_SHIFT) {
      packed = packByte(unencoded, pos++, packed, shift);
    }

    let remainder = unencoded.length - wordsEnd;
    for (let shift = WORD_SHIFT_START; remainder > -1; remainder--) {
      packIntoResult(packed, shift, result);
      shift -= WORD_SHIFT;
    }
  }

  result.push(TERMINATOR_CODE);
  return String.fromCharCode(...result);
}

function packByte(unencoded: Uint8Array, pos: number, packed: long, shift: number): long {
  return packed.or(long.fromInt(unencoded[pos] & BYTE_SIGN_MASK, true).shl(shift));
}

function packIntoResult(packed: long, shift: number, result: number[]): void {
  result.push(CODES[packed.shr(shift).low & BITS_MASK]);
}
