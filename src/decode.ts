import * as base128 from "./base128";
import * as msgpack from "msgpack-lite";
import * as S from "js.spec";

import {Identifier, IdentifierCodec} from "./identifier";
import {codecForCodeType} from "./codecs/finder";
import {codecSymbol, identifierSpec} from "./shared";

const arraySpec = S.spec.and("decoded identifier array",
    S.spec.array,
    (array) => array.length === 2,
    (array) => S.spec.integer(array[0]));


/**
 * Convert an encoded identifier string into an Identifier.
 * @param encoded the encoded string
 * @returns the identifier object
 */
export function decode<T>(encoded: any): Identifier<T> {

  if (S.valid(identifierSpec, encoded)) {
    //already an Identifier
    return encoded;
  }

  const bytes = decodeString(encoded);
  const decoded = decodeMsgPack(bytes);
  const codec = codecForCodeType(decoded[0]);
  const value = decodeWithCodec(codec, decoded[1]);

  return createIdentifier(codec, value);
}


// todo test it's a string
export function decodeString(encoded: any): Uint8Array {
  S.assert(S.spec.string, encoded);
  return base128.decode(encoded);
}

//todo test it handles bad input correctly
export function decodeMsgPack(bytes: Uint8Array): [number, any] {
  const decoded: [number, any] = msgpack.decode(bytes);
  S.assert(arraySpec, decoded);
  return decoded;
}

//todo test it calls validate
export function decodeWithCodec(codec: IdentifierCodec, decoded: any): Identifier<any> {
  codec.validateForDecoding(decoded);
  return codec.decode(decoded);
}

//todo test shape of response
export function createIdentifier(codec, value: any): Identifier<any> {
  return {
    type: codec.type,
    value: value,
    [codecSymbol]: codec
  }
}
