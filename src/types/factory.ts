import * as S from "js.spec";

import {Identifier, IdentifierCodec} from "../identifier";
import {createIdentifier} from "../decode";
import {anyCodec, AnyType} from "./any";
import {stringCodec} from "./string";
import {booleanCodec} from "./boolean";
import {integerCodec} from "./integer";
import {floatCodec} from "./float";
import {longCodec, LongInput, LongLike} from "./long";
import {datetimeCodec, DatetimeInput} from "./datetime";
import {createListCodec} from "./lists";


export interface ItemFactory<IN, OUT> {
  (value: IN): Identifier<OUT>;
}

export interface ListFactory<IN, OUT> {
  (...values: IN[]): Identifier<OUT[]>
};

export type Factory<IN, OUT, F extends ItemFactory<IN, OUT> =  ItemFactory<IN, OUT>> =
  F & {
    list: ListFactory<IN, OUT>
  };


function newFactory<IN, OUT>(itemCodec): Factory<IN, OUT> {
  const factory = ((v: IN) => newIdentifier(itemCodec, v)) as Factory<IN, OUT>;
  const listCodec = createListCodec(itemCodec);
  factory.list = (...values: IN[]): Identifier<OUT[]> => newIdentifier(listCodec, values);
  return factory;
};

function newIdentifier<T>(codec: IdentifierCodec, value: any): Identifier<T> {
  S.assert(codec.specForIdentifier, value);
  return createIdentifier(codec, codec.forIdentifier(value));
};

/**
 * Factories for identifiers.
 */
export const factory = {
  any: newFactory<AnyType, AnyType>(anyCodec),
  string: newFactory<string, string>(stringCodec),
  boolean: newFactory<boolean, boolean>(booleanCodec),
  integer: newFactory<number, number>(integerCodec),
  float: newFactory<number, number>(floatCodec),
  long: newFactory<LongInput, LongLike>(longCodec),
  datetime: newFactory<DatetimeInput, Date>(datetimeCodec)
}