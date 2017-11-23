import {expect} from "chai";

import {stringCodec} from "../../src/types/string";


describe("string codec", () => {
  it("supports encoding", () => {
    const value = "ballast";
    expect(() => stringCodec.validateForIdentifier(value)).to.not.throw();
    expect(() => stringCodec.validateForIdentifier(1)).to.throw();
    const actual = stringCodec.encode(value);
    expect(actual).to.equal(value);
  })

  it("supports decoding", () => {
    const value = "ballast";
    expect(() => stringCodec.validateForDecoding(value)).to.not.throw();
    expect(() => stringCodec.validateForDecoding(1)).to.throw();
    const actual = stringCodec.decode(value);
    expect(actual).to.equal(value);
  });
});