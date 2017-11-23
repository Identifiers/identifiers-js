import {expect} from "chai";

import {booleanCodec} from "../../src/types/boolean";


describe("boolean codec", () => {
  it("supports encoding", () => {
    const value = false;
    expect(() => booleanCodec.validateForIdentifier(value)).to.not.throw();
    expect(() => booleanCodec.validateForIdentifier(1)).to.throw();
    const actual = booleanCodec.encode(value);
    expect(actual).to.equal(value);
  });

  it("supports decoding", () => {
    const value = true;
    expect(() => booleanCodec.validateForDecoding(value)).to.not.throw();
    expect(() => booleanCodec.validateForDecoding(1)).to.throw();
    const actual = booleanCodec.decode(value);
    expect(actual).to.equal(value);
  });
});