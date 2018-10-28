import {expect} from "chai";
import * as Long from "long";

import * as ID from "../src";
import {codecSymbol, TypedObject} from "../src/shared";
import {Identifier} from "../src/identifier";
import {ImmutableDate} from "../src/types/immutable-date";
import {UuidLike} from "../src/types/uuid";

type IdExpectation<T> =  (encoded: Identifier<T>, decoded: Identifier<T>) => void;

function compareIDs<T>(id: Identifier<T>, decoded: Identifier<T>, expectation?: IdExpectation<T>): void {
  if (expectation) {
    expectation(id, decoded);
  } else {
    //don't check for functions here
    expect(decoded).to.deep.include({
      type: id.type,
      value: id.value,
      // @ts-ignore
      [codecSymbol]: id[codecSymbol]
    });
  }
}

function roundTrip<T>(id: Identifier<T>, expectation?: IdExpectation<T>): void {
  let encoded = id.toDataString();
  let decoded: Identifier<T> = ID.decodeFromString(encoded);
  compareIDs(id, decoded, expectation);

  encoded = id.toHumanString();
  decoded = ID.decodeFromString(encoded);
  compareIDs(id, decoded, expectation);

  encoded = id.toJSON();
  decoded = ID.decodeFromString(encoded);
  compareIDs(id, decoded, expectation);
}

describe("handles unknown identifier types", () => {
  // todo somehow have to create an unknown identifier string
  // start with a known identifier, add an unknown semantic flag value, get the codec and encode it.
});

describe("round-trip identifiers to strings using factory functions", () => {

  it("string", () => {
    roundTrip(ID.factory.string(""));
    roundTrip(ID.factory.string("hello"));
    roundTrip(ID.factory.string.list("bye", "for", "now"));
    roundTrip(ID.factory.string.map({a: "one", b: "two"}));
  });

  it("boolean", () => {
    roundTrip(ID.factory.boolean(true));
    roundTrip(ID.factory.boolean.list(true, false, true, false));
    roundTrip(ID.factory.boolean.map({a: true, b: false}));
  });

  it("integer", () => {
    roundTrip(ID.factory.integer(99));
    roundTrip(ID.factory.integer.list(-7483, 0, 448, -9));
    roundTrip(ID.factory.integer.map({a: 100, b: -4543}));
  });

  it("float", () => {
    roundTrip(ID.factory.float(0.009));
    roundTrip(ID.factory.float.list(0.08, 67664, -0.009917764));
    roundTrip(ID.factory.float.map({a: 22.12, b: -0.6}));
  });

  it("long", () => {
    // Long comes from both msgpack and locally. They cannot be compared exactly because instanceof fails across modules.
    const compareLong = (id1: Identifier<Long>, id2: Identifier<Long>) => id1.value.equals(id2.value);
    roundTrip(ID.factory.long(-4095), compareLong);
    roundTrip(ID.factory.long(8700), compareLong);
    roundTrip(ID.factory.long(2 ** 63), compareLong);
    roundTrip(ID.factory.long(Number.MAX_SAFE_INTEGER), compareLong);
    roundTrip(ID.factory.long(Number.MIN_SAFE_INTEGER), compareLong);
    roundTrip(ID.factory.long(Long.fromBits(63, 65535)), compareLong);
    roundTrip(ID.factory.long({low: 766745, high: 2900}), compareLong);
    roundTrip(ID.factory.long({low: 89, high: 420, unsigned: false}), compareLong);
    const extractLong = (value: Long) => value.toString();
    roundTrip(ID.factory.long.list(1987, 2 ** 58, Long.fromNumber(-100), {low: -50, high: 5564}), createListExpectation(extractLong));
    roundTrip(ID.factory.long.map({a: 20, b: 2 ** 62, c: Long.fromNumber(-400), d: {low: -10, high: 33}}), createMapExpectation(extractLong));
  });

  it("bytes", () => {
    roundTrip(ID.factory.bytes([]));
    roundTrip(ID.factory.bytes([255, 0, 127]));
    roundTrip(ID.factory.bytes({length: 1, 0: 250}));
    roundTrip(ID.factory.bytes(Uint8Array.from([1, 0]).buffer));
    roundTrip(ID.factory.bytes(Uint8Array.from([99, 43])));
    roundTrip(ID.factory.bytes(Uint8ClampedArray.from([100, 200])));
    roundTrip(ID.factory.bytes.list([]));
    roundTrip(ID.factory.bytes.list([[69], [88, 99]]));
    roundTrip(ID.factory.bytes.list([Uint8Array.from([100, 200])]));
    roundTrip(ID.factory.bytes.list([1], [2, 3]));
    roundTrip(ID.factory.bytes.list([1], Uint8Array.from([2, 3]), Uint8ClampedArray.from([4, 5, 6]), Uint8Array.from([7, 8]).buffer));
    roundTrip(ID.factory.bytes.map({a: []}));
    roundTrip(ID.factory.bytes.map({a: [1], b: [2, 3]}));
    roundTrip(ID.factory.bytes.map({a: [1], b: Uint8Array.from([2, 3]), c: Uint8ClampedArray.from([4, 5, 6]), d: Uint8Array.from([7, 8]).buffer}));
  });

  it("uuid", () => {
    const compareUuids = (id: Identifier<UuidLike>, decoded: Identifier<UuidLike>) => id.value.toString() === decoded.value.toString();
    roundTrip(ID.factory.uuid("00000000-0000-0000-0000-000000000000"), compareUuids);
    roundTrip(ID.factory.uuid("f565dda6-075c-11e8-ba89-0ed5f89f718b"), compareUuids);
    roundTrip(ID.factory.uuid([22, 0, 231, 77, 59, 3, 43, 127, 83, 208, 155, 32, 78, 229, 190, 3]), compareUuids);

    const extractUuid = (uuid: UuidLike) => uuid.toString();
    roundTrip(ID.factory.uuid.list(
      "3650698c-520a-4d0b-9073-5ea45ae14232",
      [22, 0, 231, 77, 59, 3, 43, 127, 83, 208, 155, 32, 78, 229, 190, 3]),
      createListExpectation(extractUuid));
    roundTrip(ID.factory.uuid.map({
      y: "0650f98c-5201-4d0b-9073-5ea45ae14232",
      z: [202, 0, 255, 77, 59, 3, 43, 127, 83, 208, 155, 32, 0, 229, 1, 23]}),
      createMapExpectation(extractUuid));
  });

  it("datetime", () => {
    const compareImmutableDates = (id: Identifier<ImmutableDate>, decoded: Identifier<ImmutableDate>) => id.value.time === decoded.value.time;
    roundTrip(ID.factory.datetime(7785646), compareImmutableDates);
    roundTrip(ID.factory.datetime(new Date()), compareImmutableDates);

    const extractTime = (id: ImmutableDate) => id.time;
    roundTrip(ID.factory.datetime.list(new Date(), 118275), createListExpectation(extractTime));
    roundTrip(ID.factory.datetime.map({a: new Date(), b: 23779545}), createMapExpectation(extractTime));
  });

  it("geo", () => {
    roundTrip(ID.factory.geo({latitude: -49, longitude: 102.43}));
    roundTrip(ID.factory.geo([19.0009, 10.998]));
    roundTrip(ID.factory.geo.list([1, 1], {latitude: -64, longitude: -179}));
    roundTrip(ID.factory.geo.map({a: {latitude: -49, longitude: 102.43}, b: [67.44, -120.253]}));
  });
});


function createListExpectation<VALUE>(valueMapper: (value: VALUE) => any) {
  return (idList: Identifier<VALUE[]>, decodedList: Identifier<VALUE[]>): void => {
    expect(decodedList).to.deep.include({
      type: idList.type,
      // @ts-ignore
      [codecSymbol]: idList[codecSymbol]
    });
    const l1 = idList.value.map(valueMapper);
    const l2 = decodedList.value.map(valueMapper);
    expect(l1).to.contain.ordered.members(l2);
  }
}

function createMapExpectation<VALUE>(valueMapper: (value: VALUE) => any) {
  return (idMap: Identifier<TypedObject<VALUE>>, decodedMap: Identifier<TypedObject<VALUE>>): void => {
    expect(decodedMap).to.deep.include({
      type: idMap.type,
      // @ts-ignore
      [codecSymbol]: idMap[codecSymbol]
    });

    const m1 = idMap.value;
    const m2 = decodedMap.value;
    const k1 = Object.keys(m1);
    const k2 = Object.keys(m2);
    expect(k1).to.have.ordered.members(k2);
    k1.forEach((key) => expect(valueMapper(m1[key])).to.equal(valueMapper(m2[key])));
  }
}