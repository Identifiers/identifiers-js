import {expect} from "chai";

import {factory, JSON_reviver} from "../src";

describe("jsonReviver", () => {

  it("turns valid encoded identifiers in JSON into identifiers", () => {
    const id1 = factory.integer(1);
    const id2 = factory.string("2");
    const obj = { a: id1, b: { c: id2 } };

    const json = JSON.stringify(obj);
    const parsed = JSON.parse(json, JSON_reviver);

    expect(parsed.a.type).to.equal(id1.type);
    expect(parsed.a.value).to.equal(id1.value);
    expect(parsed.b.c.type).to.equal(id2.type);
    expect(parsed.b.c.value).to.equal(id2.value);
  });
});