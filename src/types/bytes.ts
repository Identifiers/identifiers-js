import * as S from "js.spec";

import {IdentifierCodec} from "../identifier-codec";
import {asIsCodec} from "./shared-types";
import {isNumber} from "../shared";

export type BytesInput = ArrayLike<number> | ArrayBuffer;


function isArrayBuffer(input: BytesInput): input is ArrayBuffer {
  return input instanceof ArrayBuffer;
}

function isArrayLike(input: ArrayLike<number>): input is ArrayLike<number> {
  return typeof input === "object"
      && isNumber(input.length);
}

export function forBytesIdentifier(input: BytesInput): number[] {
  // copies the input content
  return Array.from(
    isArrayBuffer(input)
      ? new Uint8Array(input) // creates a view, does not copy the buffer
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

function isUint8Array(value: any): value is Uint8Array {
  return value instanceof Uint8Array;
}

export const bytesDecodingSpec = S.spec.predicate("bytes decoding", isUint8Array);

function encodeBytes(value: number[]): Uint8Array {
  return new Uint8Array(value);
}

function decodeBytes(decoded: Uint8Array): number[] {
  return Array.from(decoded);
}

export const bytesCodec: IdentifierCodec<BytesInput, number[], Uint8Array> = {
  type: "bytes",
  typeCode: 0x5,
  specForIdentifier: bytesInputSpec,
  specForDecoding: bytesDecodingSpec,
  forIdentifier: forBytesIdentifier,
  toDebugString: asIsCodec.toDebugString,
  encode: encodeBytes,
  decode: decodeBytes
};