import * as msgpack from "msgpack-lite";

import * as base128 from "./base128/encode";
import * as crockford32 from "./crockford32/encode";
import {Identifier, IdentifierCodec} from "./identifier";
import {findCodec} from "./finder";
import {msgpackCodec} from "./shared";

/**
 * Convert an Identifier into an encoded identifier string.
 * @param identifier the identifier object
 * @returns an encoded identifier string
 */
export function encodeToString<INPUT, VALUE, ENCODED>(identifier: Identifier<VALUE>, forHumans: boolean = false, codec?: IdentifierCodec<INPUT, VALUE, ENCODED>): string {
  codec = codec || findCodec(identifier);
  const value = encodeWithCodec(codec, identifier.value);
  const bytes = encodeBytes(codec.typeCode, value);
  return forHumans
    ? crockford32.encode(bytes)
    : base128.encode(bytes);
}

export function encodeWithCodec<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, value: VALUE): ENCODED {
  return codec.encode(value);
}

const encoderOptions = {codec: msgpackCodec};

export function encodeBytes<VALUE>(typeCode: number, value: VALUE): Uint8Array {
  return msgpack.encode([
    typeCode,
    value
  ], encoderOptions);
}
