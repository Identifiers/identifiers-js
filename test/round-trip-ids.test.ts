import {expect} from "chai";
import * as Long from "long";

import * as ids from "../src";
import {factory} from "../src";


function roundTrip(id) {
  const encoded = ids.encodeToString(id);
  const decoded = ids.decodeFromString(encoded);
  expect(decoded).to.deep.equal(id);
}

describe("round-trip identifiers to strings using factory functions", () => {

  it("any", () => {
    roundTrip(factory.any("a string"));
    roundTrip(factory.any(false));
    roundTrip(factory.any(33.456));
    roundTrip(factory.any.list("another", true, 14.44, -100));
  });

  it("string", () => {
    roundTrip(factory.string("hello"));
    roundTrip(factory.string.list("bye", "for", "now"));
  });

  it("boolean", () => {
    roundTrip(factory.boolean(true));
    roundTrip(factory.boolean.list(true, false, true, false));
  });

  it("integer", () => {
    roundTrip(factory.integer(99));
    roundTrip(factory.integer.list(-7483, 0, 448, -9));
  });

  it("float", () => {
    roundTrip(factory.float(0.009));
    roundTrip(factory.float.list(0.08, 67664, -0.009917764));
  });

  it("long", () => {
    roundTrip(factory.long(8700));
    roundTrip(factory.long(2 ** 63));
    roundTrip(factory.long(Long.fromBits(63, 65535)));
    roundTrip(factory.long({low: 766745, high: 2900}));
    roundTrip(factory.long({low: 89, high: 420, unsigned: false}));
    roundTrip(factory.long.list(1987, 2 ** 58, Long.fromNumber(-100), {low: -50, high: 5564}));
  });

  it("datetime", () => {
    roundTrip(factory.datetime(7785646));
    roundTrip(factory.datetime(new Date()));
    roundTrip(factory.datetime.list(new Date(), 118275));
  });
});
