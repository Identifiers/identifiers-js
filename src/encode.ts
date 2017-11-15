import * as base128 from "./base128/encode";
import * as msgpack from "msgpack-long-lite";
import * as S from "js.spec";

import {codecSymbol, identifierSpec} from "./shared";
import {Identifier, IdentifierCodec} from "./identifier";

/**
 * Convert an Identifier into an encoded identifier string.
 * @param identifier the identifier object
 * @returns an encoded identifier string
 */
export function toString(identifier: Identifier<any>): string {

  const codec = findCodec(identifier);
  const value = encodeWithCodec(codec, identifier.value);
  const bytes = encodeBytes(codec.typeCode, value);

  return base128.encode(bytes);
}

export function findCodec(identifier: Identifier<any>): IdentifierCodec {
  S.assert(identifierSpec, identifier);
  return identifier[codecSymbol];
}

export function encodeWithCodec(codec: IdentifierCodec, value: any): any {
  codec.validateForEncoding(value);
  return codec.encode(value);
}

export function encodeBytes(typeCode: number, value: any): Uint8Array {
  return msgpack.encode([
    typeCode,
    value
  ]);
}
