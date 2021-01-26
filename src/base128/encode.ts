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


const BITS_MASK = 0x7fn;
const CODES = Array.from(SYMBOLS, toCharCode);


export function encode(unencoded: Uint8Array): string {
  const wordCount = unencoded.length / WORD_SIZE;
  const charCount = Math.ceil(wordCount * BYTE_SIZE);
  const fullWordsEnd = Math.trunc(wordCount) * WORD_SIZE;
  const result = new Array(charCount);

  let charPos = 0;
  let bytePos = 0;

  while (bytePos < fullWordsEnd) {
    let packed = 0n;

    for (let shift = BYTE_SHIFT_START; shift > -1n; shift -= BYTE_SIZE_N) {
      packed = packByte(unencoded[bytePos++], packed, shift);
    }

    for (let shift = WORD_SHIFT_START; shift > -1n; shift -= WORD_SIZE_N) {
      result[charPos++] = packChar(packed, shift);
    }
  }

  // remainder
  if (bytePos < unencoded.length) {
    let packed = 0n;
    const len = BigInt(unencoded.length)

    for (let shift = BYTE_SHIFT_START; bytePos < len; shift -= BYTE_SIZE_N) {
      packed = packByte(unencoded[bytePos++], packed, shift);
    }

    let remainder = unencoded.length - fullWordsEnd;
    for (let shift = WORD_SHIFT_START; remainder > -1; shift -= WORD_SIZE_N) {
      result[charPos++] = packChar(packed, shift);
      --remainder;
    }
  }

  return String.fromCharCode(...result);
}

function packByte(byte: number, packed: bigint, shift: bigint): bigint {
  return packed | BigInt(byte) << shift;
}

function packChar(packed: bigint, shift: bigint): number {
  return CODES[Number(packed >> shift & BITS_MASK)];
}
