import {Identifier, IdentifierCodec} from "../identifier";
import {decodedIdSpec, identifierSpec, IDTuple, TypedObject} from "../shared";
import {LIST_TYPE_CODE} from "./lists";
import * as S from "js.spec";
import {asIsCodec} from "./shared-types";
import {decodeToIdentifier} from "../decode";
import {encodeIdTuple} from "../encode";
import {MAP_TYPE_CODE, mapValues, MapValuesSpec} from "./maps";


const COMPOSITE_TYPE_CODE = 0x40;

const specForListInput = S.spec.and("composite-list forIdentifier",
    S.spec.array, // must be an array, not a Set
    S.spec.collection("identifier item spec", identifierSpec));

const specForDecodingList = S.spec.and("composite-list decode",
    S.spec.array, // must be an array, not a Set
    S.spec.collection("decoded identifier item", decodedIdSpec));


export const listCodec: IdentifierCodec<Identifier<any>[], Identifier<any>[], IDTuple<any>[]> = {
  type: "composite-list",
  typeCode: COMPOSITE_TYPE_CODE | LIST_TYPE_CODE,
  specForIdentifier: specForListInput,
  specForDecoding: specForDecodingList,
  forIdentifier: asIsCodec.forIdentifier,
  encode: (list) => list.map(encodeIdTuple),
  decode: (list) => list.map(decodeToIdentifier)
};

const specForMapInput = S.spec.and("composite-map forIdentifier spec",
    S.spec.object,
    new MapValuesSpec(identifierSpec, "Map identifier values"));

const specForDecodingMap = S.spec.and("composite-map decode spec",
    S.spec.object,
    new MapValuesSpec(decodedIdSpec, "Map identifier values"));

export const mapCodec: IdentifierCodec<TypedObject<Identifier<any>>, TypedObject<Identifier<any>>, TypedObject<IDTuple<any>>> = {
  type: "composite-map",
  typeCode: COMPOSITE_TYPE_CODE | MAP_TYPE_CODE,
  specForIdentifier: specForMapInput,
  specForDecoding: specForDecodingMap,
  forIdentifier: asIsCodec.forIdentifier,
  encode: (map) => mapValues(map, encodeIdTuple, true),
  decode: (map) => mapValues(map, decodeToIdentifier, false)
};
