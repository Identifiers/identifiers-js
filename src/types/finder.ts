import * as primitives from "./primitives";
import * as semantics from "./semantics";
import * as shared from "../shared";
import {IdentifierCodec} from "../identifier";

export function codecForTypeCode(typeCode: number): IdentifierCodec {

  switch (typeCode) {
    case primitives.anyCodec.typeCode :
      return primitives.anyCodec;

    case primitives.stringCodec.typeCode :
      return primitives.stringCodec;

    case primitives.booleanCodec.typeCode :
      return primitives.booleanCodec;

    case primitives.integerCodec.typeCode :
      return primitives.integerCodec;

    case primitives.floatCodec.typeCode :
      return primitives.floatCodec;

    case primitives.longCodec.typeCode :
      return primitives.longCodec;

    case primitives.doubleCodec.typeCode :
      return primitives.doubleCodec;

    case semantics.datetimeCodec.typeCode :
      return semantics.datetimeCodec;

    default:
      if (typeCode <= shared.semanticTypeMask) {
        throw new Error(`No codec for typeCode '${typeCode}' found.`);
      }
      return codecForTypeCode(typeCode & shared.semanticTypeMask);
  }
}