import * as msgpack from "msgpack-lite";

import * as base128 from "./base128/encode";
import {Identifier, IdentifierCodec} from "./identifier";
import {findCodec} from "./finder";

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

export function encodeWithCodec<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, value: VALUE): ENCODED {
  return codec.encode(value);
}

export function encodeBytes<VALUE>(typeCode: number, value: VALUE): Uint8Array {
  return msgpack.encode([
    typeCode,
    value
  ]);
}
