import * as base128 from "./base128";
import * as msgpack from "msgpack-lite";
import * as S from "js.spec";

import {codecSymbol, identifierSpec} from "./shared";
import {Identifier, IdentifierCodec} from "./identifier";

/**
 * Convert an Identifier into an encoded identifier string.
 * @param identifier the identifier object
 * @returns an encoded identifier string
 */
export function encode(identifier: Identifier<any>): string {

  S.assert(identifierSpec, identifier);
  const codec = findCodec(identifier);
  const value = codec.encode(identifier.value);
  const bytes = encodeMsgPack(codec.typeCode, value);

  return base128.encode(bytes);
}

// todo test validate fails and throws an error
export function findCodec(identifier: Identifier<any>): IdentifierCodec {
  const codec = identifier[codecSymbol];
  codec.validateForEncoding(identifier.value);
  return codec;
}

// todo test it creates the correct structure (and uses msgpack)
export function encodeMsgPack(typeCode: number, value: any): Uint8Array {
  return msgpack.encode([
    typeCode,
    value
  ]);
}
