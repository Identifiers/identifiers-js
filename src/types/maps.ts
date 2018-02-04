import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {TypedObject} from "../shared";

export const MAP_TYPE_CODE = 0x20;

function mapValues<IN, OUT>(map: TypedObject<IN>, mapFn: (value: IN) => OUT): TypedObject<OUT> {
  const mapped: TypedObject<OUT> = {};
  for (const key in map) {
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

function mapSpec(itemSpec: S.Spec): S.Spec {
  return S.spec.predicate("input values Spec", (map) => mapValuesAreValid(map, itemSpec));
}

export function createMapCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>)
  : IdentifierCodec<TypedObject<INPUT>, TypedObject<VALUE>, TypedObject<ENCODED>> {

  const mapType = `${itemCodec.type}-map`;
  const forIdentifierMapSpec = S.spec.and(`${mapType} forIdentifier spec`,
    S.spec.object,
    mapSpec(itemCodec.specForIdentifier));

  const forDecodingMapSpec = S.spec.and(`${mapType} forDecoding spec`,
    S.spec.object,
    mapSpec(itemCodec.specForDecoding));

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