/**
 * UUID defined in IETF RFC 4122. Supports all versions of UUID.
 * @see https://tools.ietf.org/html/rfc4122.html
 */
import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {bytesCodec, bytesDecodingSpec, BytesInput, bytesInputSpec, forBytesIdentifier, isValidLength} from "./bytes";
import {calculateSemanticTypeCode} from "../semantic";
import {longCodec} from "./long";
import {toCharCode} from "../shared";

export interface UUIDLike {
  readonly hex: string;
  readonly bytes: number[];
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
)

const bytesToHex: string[] = [];
const hexToBytes: number[] = [];
for (let i = 0; i < 256; i++) {
  const hex = (i + 0x100).toString(16).substr(1);
  bytesToHex[i] = hex;
  hexToBytes[hex] = i;
}


function forUuidIdentifier(value: UuidInput): UUIDLike {
  return typeof value === "string"
    ? forStringUuid(value)
    : forBytesUuid(forBytesIdentifier(value));
}

const hexPos = [0, 2, 4, 6, 9, 11, 14, 16, 19, 21, 24, 26, 28, 30, 32, 34];
function forStringUuid(hex: string): UUIDLike {
  const bytes = new Array(16);
  hexPos.forEach((pos, i) => {
    const hexValue = hex.substr(pos, 2);
    bytes[i] = hexToBytes[hexValue];
  });
  return {hex, bytes};
}

const stringPattern: number[] = Array.from("........-....-....-....-............", toCharCode);
function forBytesUuid(bytes: number[]): UUIDLike {
  const chars = [...stringPattern];
  hexPos.forEach((pos, i) => {
    const hexValue = bytesToHex[bytes[i]];
    chars[pos++] = hexValue.charCodeAt(0);
    chars[pos] = hexValue.charCodeAt(1);
  });
  const hex = String.fromCharCode(...chars);
  return {hex, bytes};
}

export const uuidCodec: IdentifierCodec<UuidInput, UUIDLike, ArrayBuffer> = {
  ...bytesCodec,
  type: "uuid",
  typeCode: calculateSemanticTypeCode(longCodec.typeCode, 0),
  specForIdentifier: uuidInputSpec,
  forIdentifier: forUuidIdentifier,
  encode: (uuid) => bytesCodec.encode(uuid.bytes),
  specForDecoding: uuidDecodingSpec,
  decode: (bytes) => forUuidIdentifier(bytes)
};
