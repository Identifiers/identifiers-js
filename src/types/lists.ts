import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";

export const LIST_TYPE_CODE = 0x8;

export function createListCodec(itemCodec: IdentifierCodec, forIdentifierSpec: S.Spec, forDecodingSpec?: S.Spec): IdentifierCodec {
  const listType = `${itemCodec.type}-list`;
  const forIdentifierListSpec = S.spec.and(`${listType} spec`,
    S.spec.array, // must be an array, not a Set
    //todo consider applying itemCodec.validateForIdentifier fn. Will it generate a good error message?
    S.spec.collection(`${listType} item spec`, forIdentifierSpec, {
      [S.symbol.minCount]: 1
    }));

  const forDecodingListSpec = S.spec.and(`${listType} spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, forDecodingSpec || forIdentifierSpec, {
      [S.symbol.minCount]: 1
    }));

  return {
    type: listType,
    typeCode: LIST_TYPE_CODE | itemCodec.typeCode,
    validateForIdentifier: (list) => S.assert(forIdentifierListSpec, list),
    forIdentifier: (list) => list.map(itemCodec.forIdentifier),
    encode: (list) => list.map(itemCodec.encode),
    validateForDecoding: (list) => S.assert(forDecodingListSpec, list),
    decode: (list) => list.map(itemCodec.decode)
  }
}

