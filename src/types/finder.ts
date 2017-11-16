import * as primitives from "./primitives";
import * as semantics from "./semantics";
import * as shared from "../shared";
import {IdentifierCodec} from "../identifier";

export function codecForTypeCode(typeCode: number): IdentifierCodec {

  switch (typeCode) {
    case primitives.stringCodec.typeCode :
      return primitives.stringCodec;

    case primitives.booleanCodec.typeCode :
      return primitives.booleanCodec;

    case primitives.floatCodec.typeCode :
      return primitives.floatCodec;

    case primitives.integerCodec.typeCode :
      return primitives.integerCodec;

    case primitives.longCodec.typeCode :
      return primitives.longCodec;

    case semantics.datetimeCodec.typeCode :
      return semantics.datetimeCodec;

    default:
      if (typeCode < shared.semanticTypeMask) {
        throw new Error(`No codec for typeCode '${typeCode}' found.`);
      }
      return codecForTypeCode(typeCode - shared.semanticTypeMask); // todo how do I NOT values in JS?
  }
}