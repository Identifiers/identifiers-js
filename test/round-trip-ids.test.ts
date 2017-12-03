import {expect} from "chai";
import * as Long from "long";

import * as ids from "../src";


function roundTrip(id) {
  const encoded = ids.encodeToString(id);
  const decoded = ids.decodeFromString(encoded);
  expect(decoded).to.deep.equal(id);
}

describe("round-trip identifiers to strings using factory functions", () => {

  it("any", () => {
    roundTrip(ids.factory.any("a string"));
    roundTrip(ids.factory.any(false));
    roundTrip(ids.factory.any(33.456));
    roundTrip(ids.factory.any.list("another", true, 14.44, -100));
  });

  it("string", () => {
    roundTrip(ids.factory.string("hello"));
    roundTrip(ids.factory.string.list("bye", "for", "now"));
  });

  it("boolean", () => {
    roundTrip(ids.factory.boolean(true));
    roundTrip(ids.factory.boolean.list(true, false, true, false));
  });

  it("integer", () => {
    roundTrip(ids.factory.integer(99));
    roundTrip(ids.factory.integer.list(-7483, 0, 448, -9));
  });

  it("float", () => {
    roundTrip(ids.factory.float(0.009));
    roundTrip(ids.factory.float.list(0.08, 67664, -0.009917764));
  });

  it("long", () => {
    roundTrip(ids.factory.long(8700));
    roundTrip(ids.factory.long(2 ** 63));
    roundTrip(ids.factory.long(Long.fromBits(63, 65535)));
    roundTrip(ids.factory.long({low: 766745, high: 2900}));
    roundTrip(ids.factory.long.list(1987, 2 ** 58, Long.fromNumber(-100), {low: -50, high: 5564}));
  });

  it("datetime", () => {
    roundTrip(ids.factory.datetime(7785646));
    roundTrip(ids.factory.datetime(new Date()));
    roundTrip(ids.factory.datetime.list(new Date(), 118275));
  });
});
