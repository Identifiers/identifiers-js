import * as msgpack from "msgpack-lite";
import * as S from "js.spec";

import * as base128 from "./base128/decode";
import * as crockford32 from "./crockford32/decode";
import {Identifier, IdentifierCodec} from "./identifier";
import {codecForTypeCode} from "./finder";
import {existsPredicate, msgpackCodec} from "./shared";
import {createIdentifier} from "./factory";

/**
 * Convert an encoded identifier string into an Identifier.
 * @param encoded the encoded string
 * @returns the identifier object
 */
export function decodeFromString<INPUT, VALUE, ENCODED>(encoded: string): Identifier<VALUE> | undefined {
  const bytes = decodeString(encoded);
  if (bytes) {
    const [typeCode, decoded] = decodeBytes(bytes);
    const codec: IdentifierCodec<INPUT, VALUE, ENCODED> = codecForTypeCode(typeCode);
    const value = decodeWithCodec(codec, decoded);
    return createIdentifier<INPUT, VALUE, ENCODED>(codec, value);
  }
}

export function decodeString(encoded: string): Uint8Array | undefined {
  S.assert(S.spec.string, encoded);
  // how about a simple test first? What is the perf impact with the regex test? try changing order of test to see if one is faster than the other
  if (crockford32.REGEXP.test(encoded)) {
    return crockford32.decode(encoded);
  }
  if (base128.REGEXP.test(encoded)) {
    return base128.decode(encoded);
  }
}

const decoderOptions = {codec: msgpackCodec};

const decodedBytesSpec = S.spec.tuple("decoded bytes array",
  Number.isInteger,
  existsPredicate
);


export function decodeBytes(bytes: Uint8Array): [number, any] {
  const decoded = msgpack.decode(bytes, decoderOptions);
  S.assert(decodedBytesSpec, decoded);
  return decoded;
}

export function decodeWithCodec<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, encoded: ENCODED): VALUE {
  S.assert(codec.specForDecoding, encoded);
  return codec.decode(encoded);
}

