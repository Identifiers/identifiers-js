import * as S from "js.spec";

import {IdentifierCodec} from "../identifier-codec";
import {MAP_OF, MAP_TYPE_CODE} from "./maps";


export const LIST_TYPE_CODE = 0x8;
export const LIST_OF = 0x20;

export function createListCodec<INPUT, VALUE, ENCODED>(itemCodec: IdentifierCodec<INPUT, VALUE, ENCODED>): IdentifierCodec<INPUT[], VALUE[], ENCODED[]> {
  const listTypeCode = calculateListTypeCode(itemCodec.typeCode);
  const listType = `${itemCodec.type}-list`;
  const forIdentifierListSpec = S.spec.and(`${listType} forIdentifier spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, itemCodec.specForIdentifier));

  const forDecodingListSpec = S.spec.and(`${listType} forDecoding spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, itemCodec.specForDecoding));

  function generateDebugString(list: VALUE[]): string {
    const joined = list
      .map((value) => itemCodec.toDebugString(value))
      .join(", ");
    return `[${joined}]`;
  }

  return {
    type: listType,
    typeCode: listTypeCode,
    specForIdentifier: forIdentifierListSpec,
    specForDecoding: forDecodingListSpec,
    forIdentifier: (list) => list.map(itemCodec.forIdentifier),
    toDebugString: generateDebugString,
    encode: (list) => list.map(itemCodec.encode),
    decode: (list) => list.map(itemCodec.decode)
  };
}

export function calculateListTypeCode(itemTypeCode: number): number {
  if ((itemTypeCode & MAP_OF) === MAP_OF) {
    throw new Error(`Cannot create a List of Map of something. itemTypeCode: ${itemTypeCode}`);
  }
  if ((itemTypeCode & LIST_OF) === LIST_OF) {
    throw new Error(`Cannot create a List of List of something. itemTypeCode: ${itemTypeCode}`);
  }

  const isStructural = itemTypeCode & LIST_TYPE_CODE || itemTypeCode & MAP_TYPE_CODE;
  return itemTypeCode | (isStructural
    ? LIST_OF
    : LIST_TYPE_CODE);
}
