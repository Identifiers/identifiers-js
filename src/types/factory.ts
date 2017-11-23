import * as Long from "long";

import {Identifier, IdentifierCodec} from "../identifier";
import {createIdentifier} from "../decode";
import {anyCodec} from "./any";
import {stringCodec} from "./string";
import {booleanCodec} from "./boolean";
import {integerCodec} from "./integer";
import {floatCodec} from "./float";
import {longCodec} from "./long";
import {datetimeCodec} from "./datetime";

export function newIdentifier<T>(codec: IdentifierCodec, value: any): Identifier<T> {
  codec.validateForIdentifier(value);
  return createIdentifier(codec, codec.forIdentifier(value));
};


export function forAny(value: any): Identifier<any> {
  return newIdentifier(anyCodec, value);
}

export function forString(value: string): Identifier<string> {
  return newIdentifier(stringCodec, value);
}

export function forBoolean(value: boolean): Identifier<boolean> {
  return newIdentifier(booleanCodec, value);
}

export function forInteger(value: number): Identifier<number> {
  return newIdentifier(integerCodec, value);
}

export function forFloat(value: number): Identifier<number> {
  return newIdentifier(floatCodec, value);
}

export function forLong(value: Long | number): Identifier<Long> {
  return newIdentifier(longCodec, value);
}

export function forDatetime(value: Date | number): Identifier<Date> {
  return newIdentifier(datetimeCodec, value);
}
