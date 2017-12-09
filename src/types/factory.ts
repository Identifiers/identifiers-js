import {Identifier, IdentifierCodec} from "../identifier";
import {createIdentifier} from "../decode";
import {anyCodec, AnyType, anyListCodec} from "./any";
import {stringCodec, stringListCodec} from "./string";
import {booleanCodec, booleanListCodec} from "./boolean";
import {integerCodec, integerListCodec} from "./integer";
import {floatCodec, floatListCodec} from "./float";
import {longCodec, LongInput, LongLike, longListCodec} from "./long";
import {datetimeCodec, DatetimeInput, datetimeListCodec} from "./datetime";


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


function newFactory<IN, OUT>(itemCodec, listCodec): Factory<IN, OUT> {
  const factory = ((v: IN) => newIdentifier(itemCodec, v)) as Factory<IN, OUT>;
  factory.list = (...values: IN[]): Identifier<OUT[]> => newIdentifier(listCodec, values);
  return factory;
};

function newIdentifier<T>(codec: IdentifierCodec, value: any): Identifier<T> {
  codec.validateForIdentifier(value);
  return createIdentifier(codec, codec.forIdentifier(value));
};

/**
 * Factories for identifiers.
 */
export const factory = {
  any: newFactory<AnyType, AnyType>(anyCodec, anyListCodec),
  string: newFactory<string, string>(stringCodec, stringListCodec),
  boolean: newFactory<boolean, boolean>(booleanCodec, booleanListCodec),
  integer: newFactory<number, number>(integerCodec, integerListCodec),
  float: newFactory<number, number>(floatCodec, floatListCodec),
  long: newFactory<LongInput, LongLike>(longCodec, longListCodec),
  datetime: newFactory<DatetimeInput, Date>(datetimeCodec, datetimeListCodec)
}