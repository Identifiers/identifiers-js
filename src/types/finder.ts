import * as primitives from "./primitives";
import * as lists from "./lists";
import * as semantics from "./semantics";
import * as shared from "../shared";
import {IdentifierCodec} from "../identifier";

// todo move all awareness of [codecSymbol] in here so it finds and applies a codec to an identifier.
// Right now this knowledge is spread too much.

const codecs: IdentifierCodec[] = [];


[ primitives.anyCodec,
  primitives.stringCodec,
  primitives.booleanCodec,
  primitives.integerCodec,
  primitives.floatCodec,
  primitives.longCodec,
  lists.anyListCodec,
  lists.stringListCodec,
  semantics.datetimeCodec
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