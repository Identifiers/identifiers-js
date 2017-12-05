import {expect} from "chai";

import {integerCodec} from "../../src/types/integer";


describe("integer codec", () => {
  describe("identifier value validation", () => {
    it("accepts 32-bit integer signed values", () => {
      expect(() => integerCodec.validateForIdentifier(-100)).to.not.throw();
      expect(() => integerCodec.validateForIdentifier(0)).to.not.throw();
      expect(() => integerCodec.validateForIdentifier(10000)).to.not.throw();
      expect(() => integerCodec.validateForIdentifier((2 ** 31) - 1)).to.not.throw();
      expect(() => integerCodec.validateForIdentifier(-(2 ** 31))).to.not.throw();
    });

    it("does not accept longs, other non-number values", () => {
      expect(() => integerCodec.validateForIdentifier(20.223)).to.throw();
      expect(() => integerCodec.validateForIdentifier(787869585484)).to.throw();
      expect(() => integerCodec.validateForIdentifier((2 ** 31))).to.throw();
      expect(() => integerCodec.validateForIdentifier(-(2 ** 31) - 1)).to.throw();
    });
  });

  it("supports encoding", () => {
    const value = -205;
    const actual = integerCodec.encode(value);
    expect(actual).to.equal(value);
  });

  it("validates good values for decoding", () => {
    expect(() => integerCodec.validateForDecoding(2)).to.not.throw();
    expect(() => integerCodec.validateForDecoding(-400)).to.not.throw();
  });

  it("rejects bad values for decoding", () => {
    expect(() => integerCodec.validateForDecoding("happiness")).to.throw();
    expect(() => integerCodec.validateForDecoding(12.44)).to.throw();
    expect(() => integerCodec.validateForDecoding(2 ** 32)).to.throw();
  });

  it("supports decoding", () => {
    const value = 35957;
    const actual = integerCodec.decode(value);
    expect(actual).to.equal(value);
  });
});