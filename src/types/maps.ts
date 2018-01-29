import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";

export const MAP_TYPE_CODE = 0x20;

export type MAP<T> = { [key: string]: T };

function mapValues<IN, OUT>(map: MAP<IN>, mapFn: (value: IN) => OUT): MAP<OUT> {
  const mapped = {};
  for (const key in map) {
    mapped[key] = mapFn(map[key]);
  }
  return mapped;
}

function mapSpec(itemSpec: S.Spec): S.Spec {
  return S.spec.and("map spec",
    S.spec.predicate("not empty", (map) => Object.keys(map).length > 0),
    S.spec.predicate("input values Spec", (map) => {
    for (const key in map) {
      if (typeof key !== "string" || !S.valid(itemSpec, map[key])) {
        return false;
      }
    }
    return true;
  }));
}

export function createMapCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>): IdentifierCodec<MAP<INPUT>, MAP<VALUE>, MAP<ENCODED>> {
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