import * as S from "js.spec";

import {anySpec, anyCodec, asIsCodec, stringCodec} from "./primitives";
import {IdentifierCodec} from "../identifier";

export const LIST_TYPE_CODE = 0x8;

function createListCodec(itemCodec: IdentifierCodec, itemSpec: S.Spec): IdentifierCodec {
  const listType = `${itemCodec.type}-list`;
  const listSpec = S.spec.and(`${listType} spec`,
    S.spec.array, // must be an array, not a Set
    S.spec.collection(`${listType} item spec`, itemSpec));

  return {
    ...asIsCodec,
    type: listType,
    typeCode: LIST_TYPE_CODE | itemCodec.typeCode,
    validateForIdentifier: (list) => S.assert(listSpec, list),
    validateForDecoding: (list) => S.assert(listSpec, list),
    forIdentifier: (list) => list.map(itemCodec.forIdentifier)
  }
}

export const anyListCodec = createListCodec(anyCodec, anySpec);
export const stringListCodec = createListCodec(stringCodec, S.spec.string);

