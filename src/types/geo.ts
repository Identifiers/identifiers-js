/**
  Geolocation in decimal degrees for latitude and longitude. Conforms to the World Geodetic System (WGS).
  This identifier is based on the Geo microformat: http://microformats.org/wiki/geo
 */
import * as S from "js.spec";
import {IdentifierCodec} from "../identifier-codec";
import {registerSemanticTypeCode} from "../semantic";
import {EncodedFloat, floatCodec} from "./float";
import {LIST_TYPE_CODE} from "./lists";

export interface GeoLike {
  readonly latitude: number;
  readonly longitude: number;
}

export type GeoInput = GeoLike | number[];

function inDegreeRange(range: number): S.PredFn {
  return function degrees(value) { return value >= -range && value <= range; };
}

const latitudeSpec = S.spec.and("latitude",
  S.spec.number,
  inDegreeRange(90));

const longitudeSpec = S.spec.and("longitude",
  S.spec.number,
  inDegreeRange(180));

const geoLikeSpec = S.spec.map("GeoLike", {
  latitude: latitudeSpec,
  longitude: longitudeSpec
});

const geoArraySpec = S.spec.tuple("[lat, long]", latitudeSpec, longitudeSpec);

const geoInputSpec = S.spec.or("GeoInput spec", {
  "GeoLike": geoLikeSpec,
  "geo array": geoArraySpec
});

function isGeoLike(input: GeoInput): input is GeoLike {
  return (<GeoLike>input).latitude !== undefined;
}

function forGeoIdentifier(input: GeoInput): GeoLike {
  let latitude, longitude;
  if (isGeoLike(input)) {
    // Sadly object destructuring doesn't work with already-declared vars: {latitude, longitude} = input;
    latitude = input.latitude;
    longitude = input.longitude;
  } else {
    [latitude, longitude] = input;
  }
  return {latitude, longitude};
}

function encodeGeo({latitude, longitude}: GeoLike): EncodedFloat[] {
  return [floatCodec.encode(latitude), floatCodec.encode(longitude)];
}

function decodeToGeo([latitude, longitude]: number[]): GeoLike {
  return {latitude, longitude};
}

function generateDebugString(value: GeoLike): string {
  return `lat:${value.latitude}/long:${value.longitude}`;
}

export const geoCodec: IdentifierCodec<GeoInput, GeoLike, EncodedFloat[]> = {
  type: "geo",
  typeCode: registerSemanticTypeCode(LIST_TYPE_CODE | floatCodec.typeCode, 2),
  specForIdentifier: geoInputSpec,
  forIdentifier: forGeoIdentifier,
  toDebugString: generateDebugString,
  encode: encodeGeo,
  specForDecoding: geoArraySpec,
  decode: decodeToGeo,
};