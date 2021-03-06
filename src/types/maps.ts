import * as S from "js.spec";
import {IdentifierCodec} from "../identifier-codec";
import {TypedObject} from "../shared";
import {LIST_OF, LIST_TYPE_CODE} from "./lists";


export const MAP_TYPE_CODE = 0x10;
export const MAP_OF = 0x40;


export function mapValues<IN, OUT>(map: TypedObject<IN>, mapFn: (value: IN) => OUT, sortKeys?: boolean): TypedObject<OUT> {
  const mapped: TypedObject<OUT> = {};
  const keys = Object.keys(map);
  if (sortKeys) {
    // http://exploringjs.com/es6/ch_oop-besides-classes.html#_traversal-order-of-properties
    keys.sort();
  }
  for (const key of keys) {
    mapped[key] = mapFn(map[key]);
  }
  return mapped;
}

type MapValuesOptions = { spec: S.Spec };

/**
 * Spec to apply an item spec to every value in a map.
 */
export class MapValuesSpec extends S.AbstractSpec {
  constructor(itemSpec: S.Spec, prefix: string) {
    super(`${prefix}(${itemSpec})`, { spec: itemSpec });
  }

  itemSpec(): S.Spec {
    return (this.options as MapValuesOptions).spec
  }

  conform(value: any): any {
    const keys = Object.keys(value);
    for (const key of keys) {
      if (!S.valid(this.itemSpec(), value[key])) {
        return S.symbol.invalid;
      }
    }
    return value;
  }

  explain(path: string[], via: string[], value: any): S.Problem[] {
    let problems: S.Problem[] = [];
    const keys = Object.keys(value);
    for (const key of keys) {
      const mapValue = value[key];
      if (!S.valid(this.itemSpec(), mapValue)) {
        problems = [
          ...problems,
          ...this.itemSpec().explain([...path, key], [...via, this.name], mapValue)];
      }
    }
    return problems;
  }
}

export function createMapCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>)
    : IdentifierCodec<TypedObject<INPUT>, TypedObject<VALUE>, TypedObject<ENCODED>> {

  const mapType = `${itemCodec.type}-map`;
  const forIdentifierMapSpec = S.spec.and(`${mapType} forIdentifier()`,
    S.spec.object,
    new MapValuesSpec(itemCodec.specForIdentifier, "Map identifier values"));

  const forDecodingMapSpec = S.spec.and(`${mapType} Map forDecoding()`,
    S.spec.object,
    new MapValuesSpec(itemCodec.specForDecoding, "decoded Map values"));


  function forIdentifier(map: TypedObject<INPUT>): TypedObject<VALUE> {
    return mapValues(map, itemCodec.forIdentifier, true);
  }

  function toDebugString(map: TypedObject<VALUE>): string {
    const stringMap = mapValues(map, itemCodec.toDebugString);

    const keys = Object.keys(stringMap);
    const joined = keys
        .map((key) => `${key}: ${stringMap[key]}`)
        .join(", ");
    return `{${joined}}`;
  }

  function encodeMap(map: TypedObject<VALUE>): TypedObject<ENCODED> {
    return mapValues(map, itemCodec.encode);
  }

  function decodeMap(map: TypedObject<ENCODED>): TypedObject<VALUE> {
    return mapValues(map, itemCodec.decode);
  }

  return {
    type: mapType,
    typeCode: calculateMapTypeCode(itemCodec.typeCode),
    specForIdentifier: forIdentifierMapSpec,
    specForDecoding: forDecodingMapSpec,
    forIdentifier: forIdentifier,
    toDebugString: toDebugString,
    encode: encodeMap,
    decode: decodeMap
  }
}

export function calculateMapTypeCode(itemTypeCode: number): number {
  if ((itemTypeCode & MAP_OF) === MAP_OF) {
    throw new Error(`Cannot create a Map of Map of something. itemTypeCode: ${itemTypeCode}`);
  }
  if ((itemTypeCode & LIST_OF) === LIST_OF) {
    throw new Error(`Cannot create a Map of List of something. itemTypeCode: ${itemTypeCode}`);
  }

  const isStructural = itemTypeCode & LIST_TYPE_CODE || itemTypeCode & MAP_TYPE_CODE;
  return itemTypeCode | (isStructural
      ? MAP_OF
      : MAP_TYPE_CODE);
}
