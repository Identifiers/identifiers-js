import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {TypedObject} from "../shared";

export const MAP_TYPE_CODE = 0x20;

function mapValues<IN, OUT>(map: TypedObject<IN>, mapFn: (value: IN) => OUT): TypedObject<OUT> {
  const mapped: TypedObject<OUT> = {};
  const keys = Object.keys(map);
  for (let k = 0; k < keys.length; k++) {
    const key = keys[k];
    mapped[key] = mapFn(map[key]);
  }
  return mapped;
}

function mapValuesAreValid<T>(map: TypedObject<T>, itemSpec: S.Spec): boolean {
  const keys = Object.keys(map);
  if (keys.length === 0) {
    return false;
  }
  for (let k = 0; k < keys.length; k++) {
    const key = keys[k];
    if (!S.valid(itemSpec, map[key])) {
      return false;
    }
  }
  return true;
}

function mapValuesSpec(itemSpec: S.Spec, specName: string): S.Spec {
  const mapValuesPredicate = (map: {}) => mapValuesAreValid(map, itemSpec);
  return S.spec.predicate(specName, mapValuesPredicate);
}

export function createMapCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>)
  : IdentifierCodec<TypedObject<INPUT>, TypedObject<VALUE>, TypedObject<ENCODED>> {

  const mapType = `${itemCodec.type}-map`;
  const forIdentifierMapSpec = S.spec.and(`${mapType} forIdentifier spec`,
    S.spec.object,
    mapValuesSpec(itemCodec.specForIdentifier, "Map identifier values"));

  const forDecodingMapSpec = S.spec.and(`${mapType} forDecoding spec`,
    S.spec.object,
    mapValuesSpec(itemCodec.specForDecoding, "decoded Map values"));

  return {
    type: mapType,
    typeCode: MAP_TYPE_CODE | itemCodec.typeCode,
    specForIdentifier: forIdentifierMapSpec,
    forIdentifier: (map) => mapValues(map, itemCodec.forIdentifier),
    encode: (map) => mapValues(map, itemCodec.encode),
    specForDecoding: forDecodingMapSpec,
    decode: (map) => mapValues(map, itemCodec.decode)
  }
}