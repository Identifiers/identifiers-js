import * as S from "js.spec";

import {anySpec, anyCodec, asIsCodec} from "./primitives";
import {IdentifierCodec} from "../identifier";


const anyListSpec = S.spec.and("any-list",
  S.spec.array,
  S.spec.collection("any item", anySpec)
);

const anyListCodec: IdentifierCodec = {
  ...asIsCodec,
  type: "any-list",
  typeCode: 0x8,
  validateForIdentifier: (list) => S.assert(anyListSpec, list),
  validateForDecoding: (list) => S.assert(anyListSpec, list),
  forIdentifier:(list) => list.map(anyCodec.forIdentifier)

  //OK what about lists of identifiers? Perhaps I use that last bit to signal that the internal values are identifiers?
}