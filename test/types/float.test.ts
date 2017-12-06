import {expect} from "chai";

import {floatCodec} from "../../src/types/float";


describe("float codec", () => {
  it("validates good identifier values", () => {
    expect(() => floatCodec.validateForIdentifier(100)).to.not.throw();
    expect(() => floatCodec.validateForIdentifier(-12984.45)).to.not.throw();
  });

  it("rejects bad identifier values", () => {
    expect(() => floatCodec.validateForIdentifier(false)).to.throw();
    expect(() => floatCodec.validateForIdentifier("200.23")).to.throw();
  });

  it("supports encoding", () => {
    const value = 22.5001;
    const actual = floatCodec.encode(value);
    expect(actual).to.equal(value);
  });

  it("validates good decoded values", () => {
    expect(() => floatCodec.validateForDecoding(100)).to.not.throw();
    expect(() => floatCodec.validateForDecoding(-12984.45)).to.not.throw();
  });

  it("rejects bad decoded values", () => {
    expect(() => floatCodec.validateForDecoding(false)).to.throw();
    expect(() => floatCodec.validateForDecoding("200.23")).to.throw();
  });

  it("supports decoding", () => {
    const value = -3.114;
    const actual = floatCodec.decode(value);
    expect(actual).to.equal(value);
  });
});