import * as S from "js.spec";

import * as encode from "./encode";
import {Identifier, IdentifierCodec} from "./identifier";
import {codecSymbol, deepFreeze, TypedObject} from "./shared";
import {CompositeIdMap} from "./types/composite";


export type ItemFactory<INPUT, VALUE> = (input: INPUT) => Identifier<VALUE>;

export type ListInput<INPUT> = INPUT[] | INPUT;
export type ListFactory<INPUT, VALUE> = (...inputs: ListInput<INPUT>[]) => Identifier<VALUE[]>;

export type MapFactory<INPUT, VALUE> = (input: TypedObject<INPUT>) => Identifier<TypedObject<VALUE>>;

export type Factory<INPUT, VALUE, ITEMFACTORY extends ItemFactory<INPUT, VALUE> = ItemFactory<INPUT, VALUE>> =
  ITEMFACTORY & {
    list: ListFactory<INPUT, VALUE>,
    map: MapFactory<INPUT, VALUE>
  };

export interface CompositeFactory {
  list(...inputs: Identifier<any>[]): Identifier<Identifier<any>[]>
  map(input: CompositeIdMap): Identifier<CompositeIdMap>
}


export function createListFactory<INPUT, VALUE, ENCODED>(
      listCodec: IdentifierCodec<INPUT[], VALUE[], ENCODED[]>)
      : ListFactory<INPUT, VALUE> {

  return (...inputs) => {
    //inputs may be an array, but spread operator wraps it in another array. Extract the original array.
    if (inputs.length === 1 && Array.isArray(inputs[0])) {
      inputs = inputs[0] as ListInput<INPUT>[];
    }
    return newIdentifier(listCodec, inputs);
  };
}

export function createMapFactory<INPUT, VALUE, ENCODED>(
    mapCodec: IdentifierCodec<TypedObject<INPUT>, TypedObject<VALUE>, TypedObject<ENCODED>>)
    : MapFactory<INPUT, VALUE> {

  return (mapInput) => newIdentifier(mapCodec, mapInput);
}

export function createFactory<INPUT, VALUE, ENCODED>(
    itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>,
    listCodec: IdentifierCodec<INPUT[], VALUE[], ENCODED[]>,
    mapCodec: IdentifierCodec<TypedObject<INPUT>, TypedObject<VALUE>, TypedObject<ENCODED>>)
    : Factory<INPUT, VALUE> {

  const factory = ((input) => newIdentifier(itemCodec, input)) as Factory<INPUT, VALUE>;
  factory.list = createListFactory(listCodec);
  factory.map = createMapFactory(mapCodec);
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
    toString: () => encode.toDebugString(identifier),
    toHumanString: () => encode.toBase32String(identifier),
    toDataString: () => encode.toBase128String(identifier),
    toJSON: (key) => encode.toBase128String(identifier),
    [codecSymbol]: codec
  };
  return deepFreeze(identifier);
}
