import * as S from "js.spec";

import {Identifier, IdentifierCodec} from "./identifier";
import {createIdentifier} from "./decode";


export interface ItemFactory<INPUT, VALUE> {
  (input: INPUT): Identifier<VALUE>;
}

export interface ListFactory<INPUT, VALUE> {
  (...inputs: INPUT[]): Identifier<VALUE[]>
};

export type Factory<INPUT, VALUE, ITEMFACTORY extends ItemFactory<INPUT, VALUE> = ItemFactory<INPUT, VALUE>> =
  ITEMFACTORY & {
    list: ListFactory<INPUT, VALUE>
  };


export function createFactory<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>, listCodec: IdentifierCodec<INPUT[], VALUE[], ENCODED[]>): Factory<INPUT, VALUE> {
  const factory = ((input) => newIdentifier(itemCodec, input)) as Factory<INPUT, VALUE>;
  factory.list = (...inputs) => newIdentifier(listCodec, inputs);
  return factory;
};

function newIdentifier<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, input: INPUT): Identifier<VALUE> {
  S.assert(codec.specForIdentifier, input);
  return createIdentifier(codec, codec.forIdentifier(input));
};