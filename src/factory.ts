import * as S from "js.spec";

import {Identifier, IdentifierCodec} from "./identifier";
import {codecSymbol, deepFreeze} from "./shared";
import {encodeToBase128String, encodeToBase32String} from "./encode";
import {MAP} from "./types/maps";

export interface ItemFactory<INPUT, VALUE> {
  (input: INPUT): Identifier<VALUE>;
}

export interface ListFactory<INPUT, VALUE> {
  (...inputs: INPUT[]): Identifier<VALUE[]>
};

export interface MapFactory<INPUT, VALUE> {
  (mapInput: MAP<INPUT>): Identifier<MAP<VALUE>>
}

export type Factory<INPUT, VALUE, ITEMFACTORY extends ItemFactory<INPUT, VALUE> = ItemFactory<INPUT, VALUE>> =
  ITEMFACTORY & {
    list: ListFactory<INPUT, VALUE>,
    map: MapFactory<INPUT, VALUE>
  };


export function createFactory<INPUT, VALUE, ENCODED>(
    itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>,
    listCodec: IdentifierCodec<INPUT[], VALUE[], ENCODED[]>,
    mapCodec: IdentifierCodec<MAP<INPUT>, MAP<VALUE>, MAP<ENCODED>>)
    : Factory<INPUT, VALUE> {
  const factory = ((input) => newIdentifier(itemCodec, input)) as Factory<INPUT, VALUE>;
  factory.list = (...inputs) => newIdentifier(listCodec, inputs);
  factory.map = (mapInput) => newIdentifier(mapCodec, mapInput);
  return factory;
};

function newIdentifier<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, input: INPUT): Identifier<VALUE> {
  S.assert(codec.specForIdentifier, input);
  return createIdentifier(codec, codec.forIdentifier(input));
};

export function createIdentifier<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, value: VALUE): Identifier<VALUE> {
  const identifier = {
    type: codec.type,
    value: value,
    [codecSymbol]: codec,
    toString: () => encodeToBase128String(identifier),
    toBase32String: () => encodeToBase32String(identifier),
    toJSON: (key) => encodeToBase128String(identifier)
  };
  return deepFreeze(identifier);
}

