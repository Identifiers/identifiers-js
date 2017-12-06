import {expect} from "chai";

import {stringCodec} from "../../src/types/string";


describe("string codec", () => {
  it("validates good identifier values", () => {
    expect(() => stringCodec.validateForIdentifier("maximus")).to.not.throw();
    expect(() => stringCodec.validateForIdentifier("")).to.not.throw();
  });

  it("rejects bad identifier values", () => {
    expect(() => stringCodec.validateForIdentifier(false)).to.throw();
    expect(() => stringCodec.validateForIdentifier(1)).to.throw();
  });

  it("supports encoding", () => {
    const value = "ships";
    const actual = stringCodec.encode(value);
    expect(actual).to.equal(value);
  });

  it("validates good decoded values", () => {
    expect(() => stringCodec.validateForDecoding("maximus")).to.not.throw();
    expect(() => stringCodec.validateForDecoding("")).to.not.throw();
  });

  it("rejects decoding bad values", () => {
    expect(() => stringCodec.validateForDecoding(false)).to.throw();
    expect(() => stringCodec.validateForDecoding(1)).to.throw();

    it("supports decoding", () => {
      const value = "ballast";
      const actual = stringCodec.decode(value);
      expect(actual).to.equal(value);
    });
  });
});