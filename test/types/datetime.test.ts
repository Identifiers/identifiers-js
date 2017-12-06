import {expect} from "chai";

import {datetimeCodec} from "../../src/types/datetime";

describe("datetime codec", () => {
  it("validates good identifier values", () => {
    expect(() => datetimeCodec.validateForIdentifier(new Date())).to.not.throw();
    expect(() => datetimeCodec.validateForIdentifier(33779563)).to.not.throw();
  });

  it("rejects bad identifier values", () => {
    expect(() => datetimeCodec.validateForIdentifier("2017")).to.throw();
    expect(() => datetimeCodec.validateForIdentifier(224.3)).to.throw();
  });

  it("supports encoding", () => {
    const value = new Date();
    const actual = datetimeCodec.encode(value);
    expect(actual).to.equal(value.getTime());
  });

  it("validates good decoded values", () => {
    expect(() => datetimeCodec.validateForDecoding(33779563)).to.not.throw();
  });

  it("rejects decoding bad values", () => {
    expect(() => datetimeCodec.validateForDecoding(new Date())).to.throw();
    expect(() => datetimeCodec.validateForDecoding("2017")).to.throw();
    expect(() => datetimeCodec.validateForDecoding(224.3)).to.throw();
  });

  it("supports decoding", () => {
    const value = new Date().getTime();
    const actual = datetimeCodec.decode(value);
    expect(actual.getTime()).to.deep.equal(value);
  });
});