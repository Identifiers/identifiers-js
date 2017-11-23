import {expect} from "chai";

import {floatCodec} from "../../src/types/float";


describe("float codec", () => {
  it("supports encoding", () => {
    const value = 22.5;
    expect(() => floatCodec.validateForIdentifier(value)).to.not.throw();
    expect(() => floatCodec.validateForIdentifier("200")).to.throw();
    const actual = floatCodec.encode(value);
    expect(actual).to.equal(value);
  });

  it("supports decoding", () => {
    const value = -3.114;
    expect(() => floatCodec.validateForDecoding(value)).to.not.throw();
    expect(() => floatCodec.validateForDecoding(false)).to.throw();
    const actual = floatCodec.decode(value);
    expect(actual).to.equal(value);
  });
});