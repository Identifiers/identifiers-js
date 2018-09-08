import * as S from "js.spec";
import {IdentifierCodec} from "../identifier";
import {TypedObject} from "../shared";

export const MAP_TYPE_CODE = 0x10;

export function mapValues<IN, OUT>(map: TypedObject<IN>, mapFn: (value: IN) => OUT, sortKeys?: boolean): TypedObject<OUT> {
  const mapped: TypedObject<OUT> = {};
  const keys = Object.keys(map);
  if (sortKeys) {
    // http://exploringjs.com/es6/ch_oop-besides-classes.html#_traversal-order-of-properties
    keys.sort();
  }
  for (let k = 0; k < keys.length; k++) {
    const key = keys[k];
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
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      if (!S.valid(this.itemSpec(), value[key])) {
        return S.symbol.invalid;
      }
    }
    return value;
  }

  explain(path: string[], via: string[], value: any): S.Problem[] {
    let problems: S.Problem[] = [];
    const keys = Object.keys(value);
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
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

  function generateDebugString(map: TypedObject<VALUE>): string {
    const stringMap = mapValues(map, itemCodec.toDebugString);

    const keys = Object.keys(stringMap);
    const joined = keys
        .map((key) => `${key}: ${stringMap[key]}`)
        .join(", ");
    return `{${joined}}`;
  }

  return {
    type: mapType,
    typeCode: MAP_TYPE_CODE | itemCodec.typeCode,
    specForIdentifier: forIdentifierMapSpec,
    specForDecoding: forDecodingMapSpec,
    forIdentifier: (map) => mapValues(map, itemCodec.forIdentifier, true),
    toDebugString: generateDebugString,
    encode: (map) => mapValues(map, itemCodec.encode),
    decode: (map) => mapValues(map, itemCodec.decode)
  }
}