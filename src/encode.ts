import * as msgpack from "msgpack-lite";
import * as S from "js.spec";

import * as base128 from "./base128/encode";
import {Identifier} from "./identifier";
import {findCodec} from "./types/finder";

/**
 * Convert an Identifier into an encoded identifier string.
 * @param identifier the identifier object
 * @returns an encoded identifier string
 */
export function encodeToString<VALUE>(identifier: Identifier<VALUE>): string {
  const codec = findCodec(identifier);
  const value = encodeWithCodec(codec, identifier.value);
  const bytes = encodeBytes(codec.typeCode, value);
  return base128.encode(bytes);
}

export function encodeWithCodec<INPUT, VALUE, ENCODED>(codec, value): ENCODED {
  // Don't trust the identifier was constructed with the factories
  S.assert(codec.specForIdentifier, value);
  return codec.encode(codec.forIdentifier(value));
}

export function encodeBytes<VALUE>(typeCode: number, value: VALUE): Uint8Array {
  return msgpack.encode([
    typeCode,
    value
  ]);
}
