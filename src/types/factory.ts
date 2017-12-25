import * as S from "js.spec";

import {Identifier} from "../identifier";
import {createIdentifier} from "../decode";


export interface ItemFactory<INPUT, VALUE> {
  (input: INPUT): Identifier<VALUE>;
}

export interface ListFactory<INPUT, VALUE> {
  (...inputs: INPUT[]): Identifier<VALUE[]>
};

export type Factory<INPUT, VALUE, F extends ItemFactory<INPUT, VALUE> = ItemFactory<INPUT, VALUE>> =
  F & {
    list: ListFactory<INPUT, VALUE>
  };


export function createFactory<INPUT, VALUE>(itemCodec, listCodec): Factory<INPUT, VALUE> {
  const factory = ((input: INPUT) => newIdentifier(itemCodec, input)) as Factory<INPUT, VALUE>;
  factory.list = (...inputs: INPUT[]): Identifier<VALUE[]> => newIdentifier(listCodec, inputs);
  return factory;
};

function newIdentifier<INPUT, VALUE, ENCODED>(codec, input) {
  S.assert(codec.specForIdentifier, input);
  return createIdentifier(codec, codec.forIdentifier(input));
};