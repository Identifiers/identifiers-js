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

  it("forAny()", () => {
    roundTrip(ids.forAny("a string"));
    roundTrip(ids.forAny(false));
    roundTrip(ids.forAny(33.456));
  });

  it("forString()", () => {
    roundTrip(ids.forString("hello"));
  });

  it("forBoolean()", () => {
    roundTrip(ids.forBoolean(true));
  });

  it("forInteger()", () => {
    roundTrip(ids.forInteger(99));
  });

  it("forFloat()", () => {
    roundTrip(ids.forFloat(0.009));
  });

  it("forLong()", () => {
    roundTrip(ids.forLong(8700), expectForLong);
    roundTrip(ids.forLong(2 ** 63), expectForLong);
    roundTrip(ids.forLong(Long.fromBits(63, 65535)), expectForLong);
    roundTrip(ids.forLong({low: 766745, high: 2900}), expectForLong);
  });

  it("forDatetime()", () => {
    roundTrip(ids.forDatetime(7785646));
    roundTrip(ids.forDatetime(new Date()));
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