import {expect} from "chai";

import * as ids from "../src";


function roundTrip(id) {
  const encoded = ids.encodeToString(id);
  const decoded = ids.decodeFromString(encoded);
  expect(decoded).to.deep.equal(id);
}

describe("round-trip identifiers to strings", () => {

  it("uses identifier factory functions", () => {
    roundTrip(ids.forAny(null));
    roundTrip(ids.forString("hello"));
    roundTrip(ids.forBoolean(true));
    roundTrip(ids.forInteger(99));
    roundTrip(ids.forFloat(0.009));
    roundTrip(ids.forLong(8700));
    // roundTrip(ids.forLong(2 ** 63));
    roundTrip(ids.forDatetime(new Date()));
  });
});
