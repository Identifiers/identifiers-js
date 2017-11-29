import * as S from "js.spec";

import * as shared from "../shared";
import {codecSymbol, existsPredicate} from "../shared";
import {Identifier, IdentifierCodec} from "../identifier";
import {anyCodec, anyListCodec} from "./any";
import {booleanCodec, booleanListCodec} from "./boolean";
import {stringCodec, stringListCodec} from "./string";
import {integerCodec, integerListCodec} from "./integer";
import {floatCodec, floatListCodec} from "./float";
import {longCodec, longListCodec} from "./long";
import {datetimeCodec, datetimeListCodec} from "./datetime";


const codecs: IdentifierCodec[] = [];
[ anyCodec,
  anyListCodec,
  stringCodec,
  stringListCodec,
  booleanCodec,
  booleanListCodec,
  integerCodec,
  integerListCodec,
  floatCodec,
  floatListCodec,
  longCodec,
  longListCodec,
  datetimeCodec,
  datetimeListCodec
].forEach((codec) => codecs[codec.typeCode] = codec);


export function codecForTypeCode(typeCode: number): IdentifierCodec {
  const codec = codecs[typeCode];
  if (codec) {
    return codec;
  }
  if (typeCode <= shared.semanticTypeMask) {
    throw new Error(`No codec for typeCode '${typeCode}' found.`);
  }
  return codecForTypeCode(typeCode & shared.semanticTypeMask);
}


function hasCodecSymbol(id: any): boolean {
  return S.valid(S.spec.object, id[codecSymbol]);
}

export const identifierSpec = S.spec.and("identifier",
    hasCodecSymbol,
    S.spec.map("identifier structure", {
      type: S.spec.string,
      value: existsPredicate
    }));

export function findCodec(identifier: Identifier<any>): IdentifierCodec {
  S.assert(identifierSpec, identifier);
  const codec = identifier[codecSymbol];
  if (codec === codecs[codec.typeCode]) {
    return codec;
  }
  throw new Error(`unknown codec found on ${JSON.stringify(identifier)} : ${JSON.stringify(codec)}`);
}