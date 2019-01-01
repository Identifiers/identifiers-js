import * as Long from "long";
import * as S from "js.spec";

import {Identifier} from "./identifier";

export const LONG_BYTES: Long[] = new Array(0x100);
for (let i = 0; i < 0x100; i++) {
  LONG_BYTES[i] = Long.fromInt(i, false);
}

export type TypedObject<T> = { [key: string]: T };

export type MapIdentifier<VALUE> = Identifier<TypedObject<VALUE>>;

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
export function exists(value: any): boolean {
  return !!value || value != null;
}

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isNumber(value: any): value is number {
  return typeof value === "number";
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

const codecAssignedSpec = S.spec.predicate("codec assigned", S.spec.object);

function hasCodecSymbol<VALUE>(identifier: Identifier<VALUE>): boolean {
  // @ts-ignore: codec not part of identifier interface
  return S.valid(codecAssignedSpec, identifier[codecSymbol]);
}

export const identifierSpec = S.spec.and("identifier",
    hasCodecSymbol,
    S.spec.map("identifier structure", {
      type: S.spec.string,
      value: exists
    })
);

export const decodedIdSpec = S.spec.tuple("decoded identifier array",
    Number.isInteger,
    exists
);