import * as S from "js.spec";

import {anyCodec, asIsCodec} from "./primitives";
import {IdentifierCodec} from "../identifier";

// should I have specific list types? I could
const anyListCodec: IdentifierCodec = {
    ...asIsCodec,
  type: "any-list",
  typeCode: 8,
  validateForIdentifier: (list) => S.assert(S.spec.array, list) && list.forEach((value) => anyCodec.forIdentifier(value)),
  validateForDecoding: (list) => list
  //OK what about lists of identifiers? Perhaps I use that last bit to signal that the internal values are identifiers?
}