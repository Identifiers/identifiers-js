import * as S from "js.spec";

import {codecSymbol, existsPredicate} from "./shared";
import {Identifier, IdentifierCodec} from "./identifier";
import {SEMANTIC_TYPE_MASK} from "./semantic";
import {SEMANTIC_TYPE_FLAG} from "./semantic";


const codecs: IdentifierCodec<any>[] = [];

export function registerCodec<INPUT, VALUE, ENCODED>(codec: IdentifierCodec<INPUT, VALUE, ENCODED>): void {
  codecs[codec.typeCode] = codec;
}

export function codecForTypeCode<INPUT, VALUE, ENCODED>(typeCode: number): IdentifierCodec<INPUT, VALUE, ENCODED> {
  const codec = codecs[typeCode];
  if (codec) {
    return codec;
  }
  if (typeCode < SEMANTIC_TYPE_FLAG) {
    throw new Error(`No codec for typeCode '${typeCode}' found.`);
  }
  return createUnknownCodec(typeCode);
}

function createUnknownCodec<INPUT, VALUE, ENCODED>(typeCode: number): IdentifierCodec<INPUT, VALUE, ENCODED> {
  const baseTypeCode = typeCode & SEMANTIC_TYPE_MASK;
  const baseCodec = codecForTypeCode(baseTypeCode);
  const unknownCodec = {
    ...baseCodec,
    type: `unknown-${baseCodec.type}`,
    typeCode: typeCode
  };
  registerCodec(unknownCodec);

  return codecForTypeCode(typeCode);
};

function hasCodecSymbol<VALUE>(identifier: Identifier<VALUE>): boolean {
  return S.valid(S.spec.object, identifier[codecSymbol]);
}

const identifierSpec = S.spec.and("identifier",
  hasCodecSymbol,
  S.spec.map("identifier structure", {
    type: S.spec.string,
    value: existsPredicate
  })
);

export function findCodec<INPUT, VALUE, ENCODED>(identifier: Identifier<VALUE>): IdentifierCodec<INPUT, VALUE, ENCODED> {
  S.assert(identifierSpec, identifier);
  const codec = identifier[codecSymbol];
  if (codec === codecs[codec.typeCode]) {
    return codec;
  }
  throw new Error(`unknown codec found on ${JSON.stringify(identifier)} : ${JSON.stringify(codec)}`);
}