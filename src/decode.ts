import * as S from "js.spec";
import * as msgpack from "msgpack-typed-numbers";

import * as decode128 from "./base128/decode";
import * as decode32 from "./base32/decode";
import {Identifier} from "./identifier";
import {codecForTypeCode} from "./finder";
import {decodedIdSpec, exists, IDTuple} from "./shared";
import {createIdentifier} from "./factory";
import {IdentifierCodec} from "./identifier-codec";

/**
 * Convert an encoded identifier string into an Identifier. The string can be in either data or human format.
 * @param encoded the encoded string
 * @returns an Identifier instance
 */
export function decodeFromString<INPUT, VALUE, ENCODED>(encoded: string): Identifier<VALUE> {
  const bytes = decodeString(encoded);
  const idTuple = decodeBytes(bytes);
  return decodeToIdentifier(idTuple);
}

export function decodeToIdentifier<INPUT, VALUE, ENCODED>(tuple: IDTuple<ENCODED>): Identifier<VALUE> {
  const [typeCode, decoded] = tuple;
  const codec: IdentifierCodec<INPUT, VALUE, ENCODED> = codecForTypeCode(typeCode);
  const value = decodeWithCodec(codec, decoded);
  return createIdentifier<INPUT, VALUE, ENCODED>(codec, value);
}

const stringSpec = S.spec.and("encoded identifier",
  S.spec.predicate("encoded string", S.spec.string),
  S.spec.predicate("not empty", (value) => exists(value) && value.length > 0));

export function decodeString(encoded: string): Uint8Array {
  S.assert(stringSpec, encoded);
  // check for encoded msgpack 2-element array
  const firstChar = encoded.charCodeAt(0);
  if (firstChar === 0xc7) { // Ç
    return decode128.decode(encoded);
  }
  if (firstChar === 0x4a || firstChar === 0x6a) { // j/J
    return decode32.decode(encoded);
  }
  throw new Error(`Not a valid encoded identifier: '${encoded}'`);
}

export function decodeBytes<ENCODED>(bytes: Uint8Array): IDTuple<ENCODED> {
  const decoded = msgpack.decode(bytes);
  S.assert(decodedIdSpec, decoded);
  return decoded;
}

export function decodeWithCodec<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, encoded: ENCODED): VALUE {
  S.assert(codec.specForDecoding, encoded);
  return codec.decode(encoded);
}

