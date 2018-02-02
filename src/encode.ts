import * as msgpack from "msgpack-lite";

import * as base128 from "./base128/encode";
import * as base32 from "./base32/encode";
import {Identifier, IdentifierCodec} from "./identifier";
import {findCodec} from "./finder";
import {IDTuple, msgpackCodec} from "./shared";

/**
 * Convert an Identifier into a base-128 encoded identifier string.
 * @param identifier the identifier object
 * @returns an encoded identifier string
 */
export function encodeToBase128String<VALUE>(identifier: Identifier<VALUE>): string {
  const bytes = encodeToBytes(identifier);
  return base128.encode(bytes);
}

/**
 * Convert an Identifier into a base-32 encoded identifier string.
 * @param identifier the identifier object
 * @returns an encoded identifier string
 */
export function encodeToBase32String<VALUE>(identifier: Identifier<VALUE>): string {
  const bytes = encodeToBytes(identifier);
  return base32.encode(bytes);
}

function encodeToBytes<VALUE>(identifier: Identifier<VALUE>): Uint8Array {
  const codec = findCodec(identifier);
  const value = encodeWithCodec(codec, identifier.value);
  return encodeBytes([codec.typeCode, value]);
}

export function encodeWithCodec<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, value: VALUE): ENCODED {
  return codec.encode(value);
}

const encoderOptions = {codec: msgpackCodec};

export function encodeBytes<VALUE>(tuple: IDTuple<VALUE>): Uint8Array {
  return msgpack.encode(tuple, encoderOptions);
}
