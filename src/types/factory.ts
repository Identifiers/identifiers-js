import * as S from "js.spec";

import {Identifier, IdentifierCodec} from "../identifier";
import {createIdentifier} from "../decode";


export interface ItemFactory<IN, OUT> {
  (value: IN): Identifier<OUT>;
}

export interface ListFactory<IN, OUT> {
  (...values: IN[]): Identifier<OUT[]>
};

export type Factory<IN, OUT, F extends ItemFactory<IN, OUT> = ItemFactory<IN, OUT>> =
  F & {
    list: ListFactory<IN, OUT>
  };


export function createFactory<IN, OUT>(itemCodec, listCodec): Factory<IN, OUT> {
  const factory = ((v: IN) => newIdentifier(itemCodec, v)) as Factory<IN, OUT>;
  factory.list = (...values: IN[]): Identifier<OUT[]> => newIdentifier(listCodec, values);
  return factory;
};

function newIdentifier<T>(codec: IdentifierCodec, value: any): Identifier<T> {
  S.assert(codec.specForIdentifier, value);
  return createIdentifier(codec, codec.forIdentifier(value));
};