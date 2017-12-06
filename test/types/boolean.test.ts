import {expect} from "chai";

import {booleanCodec} from "../../src/types/boolean";


describe("boolean codec", () => {
  it("validates good identifier values", () => {
    expect(() => booleanCodec.validateForIdentifier(true)).to.not.throw();
    expect(() => booleanCodec.validateForIdentifier(false)).to.not.throw();
  });

  it("rejects bad identifier values", () => {
    expect(() => booleanCodec.validateForIdentifier(1)).to.throw();
    expect(() => booleanCodec.validateForIdentifier(null)).to.throw();
  });

  it("supports encoding", () => {
    const value = false;
    const actual = booleanCodec.encode(value);
    expect(actual).to.equal(value);
  });

  it("validates good decoded values", () => {
    expect(() => booleanCodec.validateForDecoding(true)).to.not.throw();
    expect(() => booleanCodec.validateForDecoding(false)).to.not.throw();
  });

  it("rejects decoding bad values", () => {
    expect(() => booleanCodec.validateForDecoding(0)).to.throw();
    expect(() => booleanCodec.validateForDecoding("false")).to.throw();
    expect(() => booleanCodec.validateForDecoding(null)).to.throw();
  });

  it("supports decoding", () => {
    const value = true;
    const actual = booleanCodec.decode(value);
    expect(actual).to.equal(value);
  });
});