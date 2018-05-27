import * as msgpack from "msgpack-lite";
import * as Long from "long";


export const BYTE_MASK = 0xff;
export const NOT_A_CODE = Long.fromInt(-1, false);
export const LONG_BYTES: Long[] = new Array(0x100);
for (let i = 0; i < 0x100; i++) {
  LONG_BYTES[i] = Long.fromInt(i, false);
}

export type TypedObject<T> = { [key: string]: T };

/**
 * Msgpack codec configured to make life easier for codecs.
 */
export const msgpackCodec = msgpack.createCodec({
  // decodes int64 to buffer instead of number
  int64: true,
  // use UInt8Array instead of Buffer
  uint8array: true,
  // uses ArrayBuffer instead of Buffer for bin types
  binarraybuffer: true
});

/**
 * Symbol key to store codec in an identifier instance.
 */
export const codecSymbol: symbol = Symbol.for("id-codec");

/**
 * Common predicate used to test if a value exists--neither undefined or null. Checks for boolean values so that
 * a value of 'false' will return true fo this method because the value exists.
 * @param value the value to test
 * @returns true if the value exists, regardless of it's actual value
 */
export function existsPredicate(value: any): boolean {
  return !!value || value != null;
}

/**
 * Recursively deep-freeze objects.
 * @param obj the object to deep freeze
 * @returns the frozen object
 */
export function deepFreeze<T extends TypedObject<any>>(obj: T): T {
  Object.freeze(obj);
  for (const prop of Object.getOwnPropertyNames(obj)) {
    const value = obj[prop];
    if (value !== null
        && typeof value === "object"
        && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }
  return obj;
}

/**
 * Convenience function to extract the first character code from a string.
 */
export function toCharCode(char: string): number {
  return char.charCodeAt(0);
}

//msgPack tuple
export interface IDTuple<VALUE> extends Array<number | VALUE> {
  0: number,
  1: VALUE
}