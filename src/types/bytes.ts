import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";

export type BytesInput = ArrayLike<number> | ArrayBuffer | Buffer;

function isArray(input: BytesInput): input is number[] {
  return Array.isArray(input);
}

function isArrayBuffer(input: BytesInput): input is ArrayBuffer {
  return input instanceof ArrayBuffer;
}

function forIdentifier(input: BytesInput): number[] {
  // copies the input content
  return Array.from(
    isArrayBuffer(input)
      ? new Uint8Array(input)
      : input);
}

function isValidType(input: BytesInput): boolean {
  return input instanceof ArrayBuffer
    || isArrayLike(input);
}

function isArrayLike(input: ArrayLike<number>): boolean {
  return typeof input === "object"
    && typeof input.length === "number";
}

function isValidLength(input: BytesInput): boolean {
  const len = isArrayBuffer(input)
    ? input.byteLength
    : input.length;
  return len < 2 ** 31;
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

export const bytesInputSpec = S.spec.and("bytes identifier",
  isValidType,
  isValidLength,
  containsOnlyBytes);

const decodingSpec = S.spec.predicate("bytes decoding", isArrayBuffer);

// msgpack sees ArrayBuffer and that triggers bin encoding.
export const bytesCodec: IdentifierCodec<BytesInput, number[], ArrayBuffer> = {
  type: "bytes",
  typeCode: 0x5,
  specForIdentifier: bytesInputSpec,
  forIdentifier: forIdentifier,
  encode: (value) => new Uint8Array(value).buffer,
  specForDecoding: decodingSpec,
  decode: (decoded) => Array.from(new Uint8Array(decoded))
};