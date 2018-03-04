import * as S from "js.spec";

import {IdentifierCodec} from "../identifier";
import {MAP_TYPE_CODE} from "./maps";


export const LIST_TYPE_CODE = 0x10;
export const LIST_OF_LISTS = 0x50;
export const LIST_OF_MAPS = 0x70;

export function createListCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>): IdentifierCodec<INPUT[], VALUE[], ENCODED[]> {

  const listTypeCode = calculateListTypeCode(itemCodec.typeCode);
  const listType = `${itemCodec.type}-list`;
  const forIdentifierListSpec = S.spec.and(`${listType} forIdentifier spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, itemCodec.specForIdentifier));

  const forDecodingListSpec = S.spec.and(`${listType} forDecoding spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, itemCodec.specForDecoding));

  return {
    type: listType,
    typeCode: listTypeCode,
    specForIdentifier: forIdentifierListSpec,
    specForDecoding: forDecodingListSpec,
    forIdentifier: (list) => list.map(itemCodec.forIdentifier),
    encode: (list) => list.map(itemCodec.encode),
    decode: (list) => list.map(itemCodec.decode)
  };
}

export function calculateListTypeCode(itemTypeCode: number): number {
  if ((itemTypeCode & LIST_OF_MAPS) === LIST_OF_MAPS) {
    throw new Error(`Cannot create a List of List of Maps. itemTypeCode: ${itemTypeCode}`);
  }
  if ((itemTypeCode & LIST_OF_LISTS) === LIST_OF_LISTS) {
    throw new Error(`Cannot create a List of List of Lists. itemTypeCode: ${itemTypeCode}`);
  }

  let listTypeCode = LIST_TYPE_CODE | itemTypeCode;
  if ((itemTypeCode & LIST_TYPE_CODE) === LIST_TYPE_CODE) {
    listTypeCode |= LIST_OF_LISTS;
  } else if ((itemTypeCode & MAP_TYPE_CODE) === MAP_TYPE_CODE) {
    listTypeCode |= LIST_OF_MAPS;
  }
  return listTypeCode;
}
