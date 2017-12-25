import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";

export const LIST_TYPE_CODE = 0x8;

export function createListCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>): IdentifierCodec<INPUT[], VALUE[], ENCODED[]> {
  const listType = `${itemCodec.type}-list`;
  const forIdentifierListSpec = S.spec.and(`${listType} spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, itemCodec.specForIdentifier, {
      [S.symbol.minCount]: 1
    }));

  const forDecodingListSpec = S.spec.and(`${listType} spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, itemCodec.specForDecoding, {
      [S.symbol.minCount]: 1
    }));

  return {
    type: listType,
    typeCode: LIST_TYPE_CODE | itemCodec.typeCode,
    specForIdentifier: forIdentifierListSpec,
    forIdentifier: (list) => list.map(itemCodec.forIdentifier),
    encode: (list) => list.map(itemCodec.encode),
    specForDecoding: forDecodingListSpec,
    decode: (list) => list.map(itemCodec.decode)
  }
}

/*
export function createFixedListCodec(...itemCodecs: IdentifierCodec[]): IdentifierCodec {
}
*/

