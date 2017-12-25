import * as msgpack from "msgpack-lite";
import * as S from "js.spec";

import * as base128 from "./base128/decode";
import {Identifier, IdentifierCodec} from "./identifier";
import {codecForTypeCode} from "./types/finder";
import {existsPredicate, codecSymbol} from "./shared";


/**
 * Convert an encoded identifier string into an Identifier.
 * @param encoded the encoded string
 * @returns the identifier object
 */
export function decodeFromString<INPUT, VALUE, ENCODED>(encoded: string): Identifier<VALUE> {
  const bytes = decodeString(encoded);
  const [typeCode, decoded] = decodeBytes(bytes);
  const codec: IdentifierCodec<INPUT, VALUE, ENCODED> = codecForTypeCode(typeCode);
  const value = decodeWithCodec(codec, decoded);
  return createIdentifier<INPUT, VALUE, ENCODED>(codec, value);
}


export function decodeString(encoded: string): Uint8Array {
  S.assert(S.spec.string, encoded);
  return base128.decode(encoded);
}

// decodes int64 to buffer instead of number
const int64Codec = msgpack.createCodec({int64: true});
const arraySpec = S.spec.tuple("decoded identifier array",
  Number.isInteger,
  existsPredicate
);

export function decodeBytes(bytes: Uint8Array): [number, any] {
  const decoded: [number, any] = msgpack.decode(bytes, {codec: int64Codec});
  S.assert(arraySpec, decoded);
  return decoded;
}

export function decodeWithCodec<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, encoded: ENCODED): VALUE {
  S.assert(codec.specForDecoding, encoded);
  return codec.decode(encoded);
}

export function createIdentifier<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, value: VALUE): Identifier<VALUE> {
  return {
    type: codec.type,
    value: value,
    [codecSymbol]: codec
  }
}
