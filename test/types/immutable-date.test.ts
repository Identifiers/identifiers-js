import {expect} from "chai";

import {createImmutableDate} from "../../src/types/immutable-date";

describe("immutable-date", () => {
  it("creates immutable date from number", () => {
    const expected = 776;
    const actual = createImmutableDate(expected);
    expect(actual.time).to.equal(expected);
  });

  it("creates immutable date from Date", () => {
    const expected = new Date();
    const actual = createImmutableDate(expected);
    expect(actual.time).to.equal(expected.getTime());
  });

  it("immutable date cannot be modified by accessing time field", () => {
    const expected = 1000;
    const actual: object = createImmutableDate(expected);
    expect(() => actual["time"] = 99999).to.throw();
  });

  it("proxies calls to methods to date object", () => {
    const expected = new Date();
    const actual = createImmutableDate(expected);
    expect(actual.toString()).to.equal(expected.toString());
    expect(actual.toISOString()).to.equal(expected.toISOString());
    expect(actual.toUTCString()).to.equal(expected.toUTCString());
    expect(actual.toJSON()).to.equal(expected.toJSON());
    expect(actual.toDate().getTime()).to.equal(expected.getTime());
  });
});