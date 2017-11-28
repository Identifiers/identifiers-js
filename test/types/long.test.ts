import {expect} from "chai";
import * as Long from "long";

import {longCodec} from "../../src/types/long";


describe("long codec", () => {
  it("supports encoding longs", () => {
    const value = Long.fromNumber(4764576383);
    expect(() => longCodec.validateForIdentifier(value)).to.not.throw();
    const actual = longCodec.encode(value);
    expect(actual).to.contain.ordered.members([value.low, value.high]);
  });

  it("supports decoding array of 2 numbers into a long", () => {
    const value = Long.fromNumber(4764576383);
    const longArray = [value.low, value.high];
    expect(() => longCodec.validateForDecoding(value)).to.throw();
    expect(() => longCodec.validateForDecoding([1])).to.throw();
    expect(() => longCodec.validateForDecoding([1, 2, 3])).to.throw();
    expect(() => longCodec.validateForDecoding([1, "2"])).to.throw();
    expect(() => longCodec.validateForDecoding(longArray)).to.not.throw();
    const actual = longCodec.decode(longArray);
    expect(actual).to.deep.equal({low: value.low, high: value.high});
  });
});