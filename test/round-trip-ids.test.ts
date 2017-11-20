import {expect} from "chai";
import * as Long from "long";

import * as ids from "../src";


function roundTrip(id) {
  const encoded = ids.encodeToString(id);
  const decoded = ids.decodeFromString(encoded);
  expect(decoded).to.deep.equal(id);
}

describe("round-trip identifiers to strings", () => {

  it("uses identifier factory functions", () => {
    roundTrip(ids.forAny("a string"));
    roundTrip(ids.forAny(false));
    roundTrip(ids.forAny(33.456));
    roundTrip(ids.forString("hello"));
    roundTrip(ids.forBoolean(true));
    roundTrip(ids.forInteger(99));
    roundTrip(ids.forFloat(0.009));
    roundTrip(ids.forLong(8700));
    roundTrip(ids.forLong(2 ** 63));
    roundTrip(ids.forLong(Long.fromBits(63, 65535)));
    roundTrip(ids.forDatetime(7785646));
    roundTrip(ids.forDatetime(new Date()));
  });
});
