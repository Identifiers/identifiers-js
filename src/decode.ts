import * as msgpack from "msgpack-lite";
import * as S from "js.spec";

import * as decode128 from "./base128/decode";
import * as decode32 from "./base32/decode";
import {Identifier} from "./identifier";
import {codecForTypeCode} from "./finder";
import {decodedIdSpec, IDTuple, msgpackCodec} from "./shared";
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

const stringSpec = S.spec.predicate("encoded string", S.spec.string);

export function decodeString(encoded: string): Uint8Array {
  S.assert(stringSpec, encoded);
  if (decode128.maybe(encoded)) {
    return decode128.decode(encoded);
  }
  if (decode32.maybe(encoded)) {
    return decode32.decode(encoded);
  }
  throw new Error(`cannot decode to identifier: '${encoded}'`);
}

const decoderOptions = {codec: msgpackCodec};

export function decodeBytes<ENCODED>(bytes: Uint8Array): IDTuple<ENCODED> {
  const decoded = msgpack.decode(bytes, decoderOptions);
  S.assert(decodedIdSpec, decoded);
  return decoded;
}

export function decodeWithCodec<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, encoded: ENCODED): VALUE {
  S.assert(codec.specForDecoding, encoded);
  return codec.decode(encoded);
}

