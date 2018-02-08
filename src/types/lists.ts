import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";


export const LIST_TYPE_CODE = 0x10;

export function createListCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>): IdentifierCodec<INPUT[], VALUE[], ENCODED[]> {
  const listType = `${itemCodec.type}-list`;
  const forIdentifierListSpec = S.spec.and(`${listType} forIdentifier spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, itemCodec.specForIdentifier));

  const forDecodingListSpec = S.spec.and(`${listType} forDecoding spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, itemCodec.specForDecoding));

  return {
    type: listType,
    typeCode: LIST_TYPE_CODE | itemCodec.typeCode,
    specForIdentifier: forIdentifierListSpec,
    specForDecoding: forDecodingListSpec,
    forIdentifier: (list) => list.map(itemCodec.forIdentifier),
    encode: (list) => list.map(itemCodec.encode),
    decode: (list) => list.map(itemCodec.decode)
  };
}
