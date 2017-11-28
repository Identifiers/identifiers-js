import {expect} from "chai";

import {integerCodec} from "../../src/types/integer";


describe("integer codec", () => {
  it("supports encoding", () => {
    const value = -205;
    expect(() => integerCodec.validateForIdentifier(value)).to.not.throw();
    expect(() => integerCodec.validateForIdentifier(20.223)).to.throw();
    expect(() => integerCodec.validateForIdentifier(787869585484)).to.throw();
    const actual = integerCodec.encode(value);
    expect(actual).to.equal(value);
  });

  it("supports decoding", () => {
    const value = 35957;
    expect(() => integerCodec.validateForDecoding(value)).to.not.throw();
    expect(() => integerCodec.validateForDecoding("happiness")).to.throw();
    const actual = integerCodec.decode(value);
    expect(actual).to.equal(value);
  });
});