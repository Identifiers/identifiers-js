import * as S from "js.spec";
import {IdentifierCodec} from "../identifier";
import {asIsCodec} from "./shared-types";

export const LIST_TYPE_CODE = 0x8;

export function createListCodec(itemCodec: IdentifierCodec, forIdentifierSpec: S.Spec, forDecodingSpec?: S.Spec): IdentifierCodec {
  const listType = `${itemCodec.type}-list`;
  const forIdentifierListSpec = S.spec.and(`${listType} spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, forIdentifierSpec));

  const forDecodingListSpec = S.spec.and(`${listType} spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, forDecodingSpec || forIdentifierSpec));

  return {
    ...asIsCodec,
    type: listType,
    typeCode: LIST_TYPE_CODE | itemCodec.typeCode,
    validateForIdentifier: (list) => S.assert(forIdentifierListSpec, list),
    validateForDecoding: (list) => S.assert(forDecodingListSpec, list),
    forIdentifier: (list) => list.map(itemCodec.forIdentifier)
  }
}

