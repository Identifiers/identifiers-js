// only import from "../src/types-export"
import * as ID from "../src/types-export";
import {factory} from "../src/types-export";

const decoded: ID.Identifier<boolean[]> = ID.decodeFromString("Ç1lfR7");
const jsonDecoded = JSON.parse('{"m": "Ç1lfR7"}', ID.JSON_reviver);
const stringId: ID.Identifier<string> = factory.string("hi there");

const boolId: ID.Identifier<boolean> = factory.boolean(true);

const intId: ID.Identifier<number> = factory.integer(1);

const floatId: ID.Identifier<number> = factory.float(55965.3342);

const myLong: ID.long.LongInput = {low: 4485645, high: -1};
const lid: ID.Identifier<ID.long.LongLike> = factory.long(myLong);
factory.long(6685894);

const bytesId: ID.Identifier<number[]> = factory.bytes([9, 21]);
factory.bytes(Uint8ClampedArray.of(1, 2, 3));
factory.bytes(Uint8Array.of(1, 2, 3));
factory.bytes(new ArrayBuffer(2));

const geoId: ID.Identifier<ID.geo.GeoLike> = ID.factory.geo({latitude: 1, longitude: 4});

const uuidId = ID.factory.uuid("3b5eaaca-99a4-40eb-9649-1305e4c72802");
const uuid2: ID.uuid.UuidInput = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
ID.factory.uuid(uuid2);

const dtf: ID.Factory<ID.datetime.DatetimeInput, ID.datetime.ImmutableDate> = factory.datetime;
const dtlf: ID.ListFactory<ID.datetime.DatetimeInput, ID.datetime.ImmutableDate> = dtf.list;
const dateListId: ID.Identifier<ID.datetime.ImmutableDate[]> = dtlf(2, 3, 4, 5);
const dtmf: ID.MapFactory<ID.datetime.DatetimeInput, ID.datetime.ImmutableDate> = dtf.map;
const dateMapId: ID.MapIdentifier<ID.datetime.ImmutableDate> = dtmf({a: new Date()});

Object.keys(dateMapId.value);
const immutableDate = dateListId.value[0]

const compListId: ID.Identifier<ID.composite.IdList> = factory.composite.list(dateMapId, lid, geoId);
const compMapId: ID.Identifier<ID.composite.IdMap> = factory.composite.map({a: uuidId, b: lid, c: geoId});

