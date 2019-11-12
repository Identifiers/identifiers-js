/**
 * UUID defined in IETF RFC 4122. Supports all versions of UUID.
 * @see https://tools.ietf.org/html/rfc4122.html
 */
import * as S from "js.spec";

import {IdentifierCodec} from "../identifier-codec";
import {bytesCodec, bytesDecodingSpec, BytesInput, bytesInputSpec, forBytesIdentifier, isValidLength} from "./bytes";
import {registerSemanticTypeCode} from "../semantic";
import {isString, toCharCode, TypedObject} from "../shared";


export interface UuidLike {
  readonly bytes: number[];
  toString(): string;
  toJSON(key?: string): string;
}

export type UuidInput = BytesInput | string;

const uuidRegex = /^[a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}$/;


function is16Bytes(input: BytesInput): boolean {
  return isValidLength(input, 16, 16);
}

function matchesUUIDPattern(value: string): boolean {
  return uuidRegex.test(value);
}

export const uuidInputSpec = S.spec.or("uuid input spec", {
  "16 bytes": S.spec.and("16 bytes",
    bytesInputSpec,
    is16Bytes),
  "string pattern": S.spec.and("string uuid",
    S.spec.string,
    matchesUUIDPattern)
});

export const uuidDecodingSpec = S.spec.and("uuid decoding spec",
  bytesDecodingSpec,
  is16Bytes
);

const bytesToHex: string[] = [];
const hexToBytes: TypedObject<number> = {};
for (let i = 0; i < 0x100; ++i) {
  const hex = (i + 0x100).toString(16).substr(1);
  bytesToHex.push(hex);
  hexToBytes[hex] = i;
}


function forIdentifier(value: UuidInput): UuidLike {
  return isString(value)
    ? forStringUuid(value)
    : forBytesUuid(forBytesIdentifier(value));
}

const hexPos = [0, 2, 4, 6, 9, 11, 14, 16, 19, 21, 24, 26, 28, 30, 32, 34];
function forStringUuid(hex: string): UuidLike {
  const bytes: number[] = [];
  hexPos.forEach((pos) => {
    const hexValue = hex.substr(pos, 2);
    bytes.push(hexToBytes[hexValue]);
  });
  return createUuidLike(hex, bytes);
}

const stringPattern: number[] = Array.from("........-....-....-....-............", toCharCode);
function forBytesUuid(bytes: number[]): UuidLike {
  const chars = [...stringPattern];
  hexPos.forEach((pos, i) => {
    const hexValue = bytesToHex[bytes[i]];
    chars[pos++] = hexValue.charCodeAt(0);
    chars[pos] = hexValue.charCodeAt(1);
  });
  const hex = String.fromCharCode(...chars);
  return createUuidLike(hex, bytes);
}

function createUuidLike(hex: string, bytes: number[]): UuidLike {
  return {
    bytes,
    toString: () => hex,
    toJSON: () => hex
  }
}

function toDebugString(uuid: UuidLike): string {
  return uuid.toString();
}

function encodeBytes(uuid: UuidLike) {
  return bytesCodec.encode(uuid.bytes);
}

function decodeBytes(bytes: Uint8Array): UuidLike {
  return forBytesUuid(Array.from(bytes));
}

export const uuidCodec: IdentifierCodec<UuidInput, UuidLike, Uint8Array> = {
  type: "uuid",
  typeCode: registerSemanticTypeCode(bytesCodec.typeCode, 0),
  specForIdentifier: uuidInputSpec,
  specForDecoding: uuidDecodingSpec,
  forIdentifier: forIdentifier,
  toDebugString: toDebugString,
  encode: encodeBytes,
  decode: decodeBytes
};
