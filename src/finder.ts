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
    typeCode,
    type: `unknown-${baseCodec.type}`
  };
  registerCodec(unknownCodec);

  return codecForTypeCode(typeCode);
}

const codecAssignedSpec = S.spec.predicate("codec assigned", S.spec.object);

function hasCodecSymbol<VALUE>(identifier: Identifier<VALUE>): boolean {
  // @ts-ignore: codec not part of identifier interface
  return S.valid(codecAssignedSpec, identifier[codecSymbol]);
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
  // @ts-ignore: codec not part of identifier interface
  const codec: IdentifierCodec<INPUT, VALUE, ENCODED> = identifier[codecSymbol];
  if (Object.is(codec, codecs[codec.typeCode])) {
    return codec;
  }
  throw new Error(`unknown codec found on ${JSON.stringify(identifier.value)} : ${JSON.stringify(codec)}`);
}