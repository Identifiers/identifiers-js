import * as primitives from "./primitives";
import {IdentifierCodec} from "../identifier";


export function codecForCodeType(typeCode: number): IdentifierCodec {

  switch (typeCode) {
    case primitives.stringCodec.typeCode :
      return primitives.stringCodec;

    case primitives.integerCodec.typeCode :
      return primitives.integerCodec;

    case primitives.floatCodec.typeCode :
      return primitives.floatCodec;

    case primitives.booleanCodec.typeCode :
      return primitives.booleanCodec;

    case primitives.datetimeCodec.typeCode :
      return primitives.datetimeCodec;

    default:
      throw new Error(`No codec for typeCode '${typeCode}' found.`);
  }
}