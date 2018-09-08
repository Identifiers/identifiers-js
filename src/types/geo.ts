/**
  Geolocation in decimal degrees for latitude and longitude. Conforms to the World Geodetic System (WGS).
  This identifier is based on the Geo microformat: http://microformats.org/wiki/geo
 */
import * as S from "js.spec";
import {IdentifierCodec} from "../identifier";
import {calculateSemanticTypeCode} from "../semantic";
import {floatCodec} from "./float";
import {LIST_TYPE_CODE} from "./lists";
import {asIsCodec} from "./shared-types";

export interface GeoLike {
  readonly latitude: number;
  readonly longitude: number;
}

function inDegreeRange(range: number): S.PredFn {
  return function degrees(value) { return value >= -range && value <= range; };
}

const latitudeSpec = S.spec.and("latitude",
  S.spec.number,
  inDegreeRange(90));

const longitudeSpec = S.spec.and("longitude",
  S.spec.number,
  inDegreeRange(180));

const geoIdentifierSpec = S.spec.map("GeoLike", {
  latitude: latitudeSpec,
  longitude: longitudeSpec
});

function forGeoIdentifier({latitude, longitude}: GeoLike): GeoLike {
  return { latitude, longitude };
}

function encodeGeo({latitude, longitude}: GeoLike): number[] {
  return [latitude, longitude];
}

const decodeGeoSpec = S.spec.tuple("lat/long", latitudeSpec, longitudeSpec);

function decodeToGeo([latitude, longitude]: number[]): GeoLike {
  return { latitude, longitude };
}

export const geoCodec: IdentifierCodec<GeoLike, GeoLike, number[]> = {
  type: "geo",
  typeCode: calculateSemanticTypeCode(LIST_TYPE_CODE | floatCodec.typeCode, 2),
  specForIdentifier: geoIdentifierSpec,
  forIdentifier: forGeoIdentifier,
  toDebugString: asIsCodec.toDebugString,
  encode: encodeGeo,
  specForDecoding: decodeGeoSpec,
  decode: decodeToGeo,
};