import {expect} from "chai";
import * as Long from "long";

import * as ID from "../src";
import {codecSymbol} from "../src/shared";

type IdComparator<T> =  (encoded: ID.Identifier<T>, decoded: ID.Identifier<T>) => boolean;

function compareIDs<T>(id: ID.Identifier<T>, decoded: ID.Identifier<T>, comparator?: IdComparator<T>): void {
  if (comparator) {
    expect(comparator(id, decoded)).to.be.true;
  } else {
    //don't check for functions here
    expect(decoded).to.deep.include({
      type: id.type,
      value: id.value,
      [codecSymbol]: id[codecSymbol]
    });
  }
};

function roundTrip<T>(id: ID.Identifier<T>, comparator?: IdComparator<T>): void {
  let encoded = id.toString();
  let decoded: ID.Identifier<T> = ID.decodeFromString(encoded);
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
    const id = ID.factory.string("matt");
    roundTrip(ID.factory.string("hello"));
    roundTrip(ID.factory.string.list("bye", "for", "now"));
  });

  it("boolean", () => {
    roundTrip(ID.factory.boolean(true));
    roundTrip(ID.factory.boolean.list(true, false, true, false));
  });

  it("integer", () => {
    roundTrip(ID.factory.integer(99));
    roundTrip(ID.factory.integer.list(-7483, 0, 448, -9));
  });

  it("float", () => {
    roundTrip(ID.factory.float(0.009));
    roundTrip(ID.factory.float.list(0.08, 67664, -0.009917764));
  });

  it("long", () => {
    roundTrip(ID.factory.long(8700));
    roundTrip(ID.factory.long(2 ** 63));
    roundTrip(ID.factory.long(Long.fromBits(63, 65535)));
    roundTrip(ID.factory.long({low: 766745, high: 2900}));
    roundTrip(ID.factory.long({low: 89, high: 420, unsigned: false}));
    roundTrip(ID.factory.long.list(1987, 2 ** 58, Long.fromNumber(-100), {low: -50, high: 5564}));
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
  });

  it("datetime", () => {
    const compareImmutableDates = (id, decoded) => id.value.time === decoded.value.time;
    roundTrip(ID.factory.datetime(7785646), compareImmutableDates);
    roundTrip(ID.factory.datetime(new Date()), compareImmutableDates);
    roundTrip(ID.factory.datetime.list(new Date(), 118275), (idList, decodedList) => {
      const l1 = idList.value.map(id => id.time);
      const l2 = decodedList.value.map(id => id.time);
      return l1.filter(t => l2.indexOf(t) < 0).length === 0;
    });
  });
});
