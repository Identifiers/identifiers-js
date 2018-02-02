import * as msgpack from "msgpack-lite";
import * as S from "js.spec";

import * as decode128 from "./base128/decode";
import * as decode32 from "./base32/decode";
import {Identifier, IdentifierCodec} from "./identifier";
import {codecForTypeCode} from "./finder";
import {existsPredicate, IDTuple, msgpackCodec} from "./shared";
import {createIdentifier} from "./factory";

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
  if (decode128.maybe(encoded)) {
    return decode128.decode(encoded);
  }
  if (decode32.maybe(encoded)) {
    return decode32.decode(encoded);
  }
  throw new Error(`cannot decode to identifier: '${encoded}'`);
}

const decoderOptions = {codec: msgpackCodec};

const decodedBytesSpec = S.spec.tuple("decoded bytes array",
  Number.isInteger,
  existsPredicate
);


export function decodeBytes<VALUE>(bytes: Uint8Array): IDTuple<VALUE> {
  const decoded = msgpack.decode(bytes, decoderOptions);
  S.assert(decodedBytesSpec, decoded);
  return decoded;
}

export function decodeWithCodec<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, encoded: ENCODED): VALUE {
  S.assert(codec.specForDecoding, encoded);
  return codec.decode(encoded);
}

