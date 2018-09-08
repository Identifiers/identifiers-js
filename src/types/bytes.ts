import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";

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
    if (!Number.isInteger(byte) || (byte < 0x0 || byte > 0xff)) {
      return false;
    }
  }
  return true;
}

export const bytesInputSpec = S.spec.and("bytes identifier",
  isValidType,
  containsOnlyBytes);

export const bytesDecodingSpec = S.spec.predicate("bytes decoding", isArrayBuffer);

// msgpack sees ArrayBuffer and that triggers bin encoding.
export const bytesCodec: IdentifierCodec<BytesInput, number[], ArrayBuffer> = {
  type: "bytes",
  typeCode: 0x5,
  specForIdentifier: bytesInputSpec,
  specForDecoding: bytesDecodingSpec,
  forIdentifier: forBytesIdentifier,
  toDebugString: asIsCodec.toDebugString,
  encode: (value) => new Uint8Array(value).buffer,
  decode: (decoded) => Array.from(new Uint8Array(decoded))
};