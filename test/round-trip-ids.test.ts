import {expect} from "chai";
import * as Long from "long";

import * as ids from "../src";
import {Identifier} from "../src/identifier";


function roundTrip(id, assertion?: (expected, actual) => void) {
  const encoded = ids.encodeToString(id);
  const decoded = ids.decodeFromString(encoded);
  if (assertion) {
    assertion(id, decoded);
  } else {
    expect(decoded).to.deep.equal(id);
  }
}

describe("round-trip identifiers to strings using factory functions", () => {

  it("any", () => {
    roundTrip(ids.factory.any("a string"));
    roundTrip(ids.factory.any(false));
    roundTrip(ids.factory.any(33.456));
  });

  it("string", () => {
    roundTrip(ids.factory.string("hello"));
  });

  it("boolean", () => {
    roundTrip(ids.factory.boolean(true));
  });

  it("integer", () => {
    roundTrip(ids.factory.integer(99));
  });

  it("float", () => {
    roundTrip(ids.factory.float(0.009));
  });

  it("long", () => {
    roundTrip(ids.factory.long(8700), expectForLong);
    roundTrip(ids.factory.long(2 ** 63), expectForLong);
    roundTrip(ids.factory.long(Long.fromBits(63, 65535)), expectForLong);
    roundTrip(ids.factory.long({low: 766745, high: 2900}), expectForLong);
  });

  it("datetime", () => {
    roundTrip(ids.factory.datetime(7785646));
    roundTrip(ids.factory.datetime(new Date()));
  });
});


function expectForLong(expected: Identifier<Long>, actual: Identifier<Long>): void {
  expect(actual).to.deep.include({
    type: expected.type,
    value: {
      low: expected.value.low,
      high: expected.value.high
  }});
}