import * as S from "js.spec";

import {codecSymbol, existsPredicate} from "../shared";
import {Identifier, IdentifierCodec} from "../identifier";
import {anyCodec} from "./any";
import {booleanCodec} from "./boolean";
import {stringCodec} from "./string";
import {integerCodec} from "./integer";
import {floatCodec} from "./float";
import {longCodec} from "./long";
import {datetimeCodec} from "./datetime";
import {SEMANTIC_TYPE_MASK} from "./shared-types";

const codecs: IdentifierCodec[] = [];
[ anyCodec,
  stringCodec,
  booleanCodec,
  integerCodec,
  floatCodec,
  longCodec,
  datetimeCodec,
].forEach((codec) => {
  codecs[codec.typeCode] = codec; //todo list codec?
});


export function codecForTypeCode(typeCode: number): IdentifierCodec {
  const codec = codecs[typeCode];
  if (codec) {
    return codec;
  }
  if (typeCode <= SEMANTIC_TYPE_MASK) {
    throw new Error(`No codec for typeCode '${typeCode}' found.`);
  }
  return codecForTypeCode(typeCode & SEMANTIC_TYPE_MASK);
}


function hasCodecSymbol(id: any): boolean {
  return S.valid(S.spec.object, id[codecSymbol]);
}

export const identifierSpec = S.spec.and("identifier",
  hasCodecSymbol,
  S.spec.map("identifier structure", {
    type: S.spec.string,
    value: existsPredicate
  })
);

export function findCodec(identifier: Identifier<any>): IdentifierCodec {
  S.assert(identifierSpec, identifier);
  const codec = identifier[codecSymbol];
  if (codec === codecs[codec.typeCode]) {
    return codec;
  }
  throw new Error(`unknown codec found on ${JSON.stringify(identifier)} : ${JSON.stringify(codec)}`);
}