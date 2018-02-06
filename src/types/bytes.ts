import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";

export type BytesInput = ArrayLike<number> | ArrayBuffer | Buffer;


function isArrayBuffer(input: BytesInput): input is ArrayBuffer {
  return input instanceof ArrayBuffer;
}

function isArrayLike(input: ArrayLike<number>): input is ArrayLike<number> {
  return typeof input === "object"
      && typeof input.length === "number";
}

export function forBytesIdentifier(input: BytesInput): number[] {
  // copies the input content
  return Array.from(
    isArrayBuffer(input)
      ? new Uint8Array(input)
      : input);
}

function isValidType(input: BytesInput): boolean {
  return isArrayBuffer(input) || isArrayLike(input);
}

export function isValidLength(input: BytesInput, minLen: number, maxLen: number): boolean {
  const len = isArrayBuffer(input)
    ? input.byteLength
    : input.length;
  return len >= minLen && len <= maxLen;
}

function containsOnlyBytes(input: ArrayLike<number>): boolean {
  for (let pos = 0; pos < input.length; pos++) {
    const byte = input[pos];
    if (!Number.isInteger(byte) || (byte < 0 || byte > 255)) {
      return false;
    }
  }
  return true;
}

function isLessThanTwoGb(input: ArrayLike<number>): boolean {
  return isValidLength(input, 0, 2 ** 31);
}

export const bytesInputSpec = S.spec.and("bytes identifier",
  isValidType,
  isLessThanTwoGb,
  containsOnlyBytes);

export const bytesDecodingSpec = S.spec.predicate("bytes decoding", isArrayBuffer);

// msgpack sees ArrayBuffer and that triggers bin encoding.
export const bytesCodec: IdentifierCodec<BytesInput, number[], ArrayBuffer> = {
  type: "bytes",
  typeCode: 0x5,
  specForIdentifier: bytesInputSpec,
  forIdentifier: forBytesIdentifier,
  encode: (value) => new Uint8Array(value).buffer,
  specForDecoding: bytesDecodingSpec,
  decode: (decoded) => Array.from(new Uint8Array(decoded))
};