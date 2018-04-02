import * as S from "js.spec";

import {Identifier, IdentifierCodec} from "./identifier";
import {codecSymbol, deepFreeze, TypedObject} from "./shared";
import {encodeToBase128String, encodeToBase32String} from "./encode";

export interface ItemFactory<INPUT, VALUE> {
  (input: INPUT): Identifier<VALUE>;
}

export type ListInput<INPUT> = INPUT[] | INPUT;
export interface ListFactory<INPUT, VALUE> {
  (...inputs: ListInput<INPUT>[]): Identifier<VALUE[]>
}

export interface MapFactory<INPUT, VALUE> {
  (mapInput: TypedObject<INPUT>): Identifier<TypedObject<VALUE>>
}

export type Factory<INPUT, VALUE, ITEMFACTORY extends ItemFactory<INPUT, VALUE> = ItemFactory<INPUT, VALUE>> =
  ITEMFACTORY & {
    list: ListFactory<INPUT, VALUE>,
    map: MapFactory<INPUT, VALUE>
  };


export function createFactory<INPUT, VALUE, ENCODED>(
    itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>,
    listCodec: IdentifierCodec<INPUT[], VALUE[], ENCODED[]>,
    mapCodec: IdentifierCodec<TypedObject<INPUT>, TypedObject<VALUE>, TypedObject<ENCODED>>)
    : Factory<INPUT, VALUE> {
  const factory = ((input) => newIdentifier(itemCodec, input)) as Factory<INPUT, VALUE>;
  factory.list = (...inputs) => {
    //inputs may be an array, but spread operator wraps it in another array. Extract the original array.
    if (inputs.length === 1 && Array.isArray(inputs[0])) {
      inputs = inputs[0] as ListInput<INPUT>[];
    }
    return newIdentifier(listCodec, inputs);
  }
  factory.map = (mapInput) => newIdentifier(mapCodec, mapInput);
  return factory;
}

function newIdentifier<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, input: INPUT): Identifier<VALUE> {
  S.assert(codec.specForIdentifier, input);
  return createIdentifier(codec, codec.forIdentifier(input));
}

export function createIdentifier<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>, value: VALUE): Identifier<VALUE> {
  const identifier: Identifier<VALUE> = {
    value,
    type: codec.type,
    toString: () => encodeToBase128String(identifier),
    toBase32String: () => encodeToBase32String(identifier),
    toJSON: (key) => encodeToBase128String(identifier),
    [codecSymbol]: codec
  };
  return deepFreeze(identifier);
}

