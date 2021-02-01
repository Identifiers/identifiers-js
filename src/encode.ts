import * as base128 from "./base128/encode";
import * as base32 from "./base32/encode";
import {Identifier} from "./identifier";
import {findCodec} from "./finder";
import {IDTuple, msgpack} from "./shared"
import {IdentifierCodec} from "./identifier-codec";

/**
 * Convert an Identifier into a base-128 encoded identifier string.
 * @param identifier the identifier object
 * @returns an encoded identifier string
 */
export function toBase128String<VALUE>(identifier: Identifier<VALUE>): string {
  const bytes = encodeToBytes(identifier);
  return base128.encode(bytes);
}

/**
 * Convert an Identifier into a base-32 encoded identifier string.
 * @param identifier the identifier object
 * @returns an encoded identifier string
 */
export function toBase32String<VALUE>(identifier: Identifier<VALUE>): string {
  const bytes = encodeToBytes(identifier);
  return base32.encode(bytes);
}

/**
 * Convert an Identifier into a debug-friendly string. Presents the type and value of the identifier.
 * @param identifier the identifier object
 * @returns a string representation of the identifier
 */
export function toDebugString<VALUE>(identifier: Identifier<VALUE>): string {
  const codec = findCodec(identifier);
  return `ID«${identifier.type}»${codec.toDebugString(identifier.value)}`;
}

function encodeToBytes<VALUE>(identifier: Identifier<VALUE>): Uint8Array {
  const tuple = encodeIdTuple(identifier);
  return encodeBytes(tuple);
}

export function encodeIdTuple<VALUE, ENCODED>(identifier: Identifier<VALUE>): IDTuple<ENCODED> {
  const codec = findCodec(identifier);
  const value = encodeWithCodec(codec, identifier.value);
  return [codec.typeCode, value as ENCODED];
}

export function encodeWithCodec<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, value: VALUE): ENCODED {
  return codec.encode(value);
}

export function encodeBytes<VALUE>(tuple: IDTuple<VALUE>): Uint8Array {
  return msgpack.pack(tuple);
}
