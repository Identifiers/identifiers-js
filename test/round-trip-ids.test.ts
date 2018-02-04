import {expect} from "chai";
import * as Long from "long";

import * as ID from "../src";
import {codecSymbol} from "../src/shared";
import {Identifier} from "../src/identifier";
import {ImmutableDate} from "../src/types/immutable-date";

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

function roundTrip<T>(id: Identifier<T>, comparator?: IdExpectation<T>): void {
  let encoded = id.toString();
  let decoded: Identifier<T> = ID.decodeFromString(encoded);
  compareIDs(id, decoded, comparator);

  encoded = id.toBase32String();
  decoded = ID.decodeFromString(encoded);
  compareIDs(id, decoded, comparator);

  encoded = id.toJSON();
  decoded = ID.decodeFromString(encoded);
  compareIDs(id, decoded, comparator);
}

describe("round-trip identifiers to strings using factory functions", () => {

  it("string", () => {
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
    roundTrip(ID.factory.long(8700));
    roundTrip(ID.factory.long(2 ** 63));
    roundTrip(ID.factory.long(Long.fromBits(63, 65535)));
    roundTrip(ID.factory.long({low: 766745, high: 2900}));
    roundTrip(ID.factory.long({low: 89, high: 420, unsigned: false}));
    roundTrip(ID.factory.long.list(1987, 2 ** 58, Long.fromNumber(-100), {low: -50, high: 5564}));
    roundTrip(ID.factory.long.map({a: 20, b: 2 ** 62, c: Long.fromNumber(-400), d: {low: -10, high: 33}}));
  });

  it("uuid", () => {
    roundTrip(ID.factory.uuid("f565dda6-075c-11e8-ba89-0ed5f89f718b"));
    roundTrip(ID.factory.uuid([22, 0, 231, 77, 59, 3, 43, 127, 83, 208, 155, 32, 78, 229, 190, 3]));
    roundTrip(ID.factory.uuid.list(
      "3650698c-520a-4d0b-9073-5ea45ae14232",
      [22, 0, 231, 77, 59, 3, 43, 127, 83, 208, 155, 32, 78, 229, 190, 3]));
    roundTrip(ID.factory.uuid.map({
      y: "0650f98c-5201-4d0b-9073-5ea45ae14232",
      z: [202, 0, 255, 77, 59, 3, 43, 127, 83, 208, 155, 32, 0, 229, 1, 23]}));
  });

  it("bytes", () => {
    roundTrip(ID.factory.bytes([]));
    roundTrip(ID.factory.bytes([255, 0, 127]));
    roundTrip(ID.factory.bytes({length: 1, 0: 250}));
    roundTrip(ID.factory.bytes(Buffer.from([255, 0, 127])));
    roundTrip(ID.factory.bytes(Uint8Array.from([1, 0]).buffer));
    roundTrip(ID.factory.bytes(Uint8Array.from([99, 43])));
    roundTrip(ID.factory.bytes(Uint8ClampedArray.from([100, 200])));
    roundTrip(ID.factory.bytes.list([]));
    roundTrip(ID.factory.bytes.list([1], [2, 3]));
    roundTrip(ID.factory.bytes.list([1], Uint8Array.from([2, 3]), Buffer.from([4, 5, 6]), Uint8Array.from([7, 8]).buffer));
    roundTrip(ID.factory.bytes.map({a: []}));
    roundTrip(ID.factory.bytes.map({a: [1], b: [2, 3]}));
    roundTrip(ID.factory.bytes.map({a: [1], b: Uint8Array.from([2, 3]), c: Buffer.from([4, 5, 6]), d: Uint8Array.from([7, 8]).buffer}));
  });

  it("datetime", () => {
    const compareImmutableDates = (id: Identifier<ImmutableDate>, decoded: Identifier<ImmutableDate>) => id.value.time === decoded.value.time;
    roundTrip(ID.factory.datetime(7785646), compareImmutableDates);
    roundTrip(ID.factory.datetime(new Date()), compareImmutableDates);
    roundTrip(ID.factory.datetime.list(new Date(), 118275), (idList, decodedList): void => {
      expect(decodedList).to.deep.include({
        type: idList.type,
        // @ts-ignore
        [codecSymbol]: idList[codecSymbol]
      });
      const l1 = idList.value.map(id => id.time);
      const l2 = decodedList.value.map(id => id.time);
      expect(l1).to.contain.ordered.members(l2);
    });
    roundTrip(ID.factory.datetime.map({a: new Date(), b: 23779545}), (idMap, decodedMap): void => {
      expect(decodedMap).to.deep.include({
        type: idMap.type,
        // @ts-ignore
        [codecSymbol]: idMap[codecSymbol]
      });

      const m1 = idMap.value;
      const m2 = decodedMap.value;
      const k1 = Object.keys(m1);
      const k2 = Object.keys(m2);
      expect(k1).to.contain.members(k2);
      for (const key in m1) {
        expect(m1[key].time).to.equal(m2[key].time);
      }
    });
  });
});
