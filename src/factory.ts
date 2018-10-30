import * as S from "js.spec";

import * as encode from "./encode";
import {Identifier} from "./identifier";
import {codecSymbol, deepFreeze, MapIdentifier, TypedObject} from "./shared";
import {CompositeIdList, CompositeIdMap} from "./types/composite";
import {IdentifierCodec} from "./identifier-codec";


export type ItemFactory<INPUT, VALUE> = (input: INPUT) => Identifier<VALUE>;

export type ListInput<INPUT> = INPUT[] | INPUT;
export type ListFactory<INPUT, VALUE> = (...inputs: ListInput<INPUT>[]) => Identifier<VALUE[]>;

export type MapFactory<INPUT, VALUE> = (input: TypedObject<INPUT>) => MapIdentifier<VALUE>;

export type Factory<INPUT, VALUE, ITEMFACTORY extends ItemFactory<INPUT, VALUE> = ItemFactory<INPUT, VALUE>> =
  ITEMFACTORY & {
    list: ListFactory<INPUT, VALUE>,
    map: MapFactory<INPUT, VALUE>
  };

export interface CompositeFactory {
  list(...inputs: CompositeIdList): Identifier<CompositeIdList>
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
    toJSON: () => encode.toBase128String(identifier),
    [codecSymbol]: codec
  };
  return deepFreeze(identifier);
}
