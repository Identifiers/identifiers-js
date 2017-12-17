import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
chai.use(jsSpecChai);

import {integerCodec} from "../../src/types/integer";


describe("integer codec", () => {
  it("validates good identifier values", () => {
    expect(-100).to.conform(integerCodec.specForIdentifier);
    expect(0).to.conform(integerCodec.specForIdentifier);
    expect(10000).to.conform(integerCodec.specForIdentifier);
    expect((2 ** 31) - 1).to.conform(integerCodec.specForIdentifier);
    expect(-(2 ** 31)).to.conform(integerCodec.specForIdentifier);
  });

  it("rejects bad identifier values", () => {
    expect(223.74).to.not.conform(integerCodec.specForIdentifier);
    expect(787869585484).to.not.conform(integerCodec.specForIdentifier);
    expect(2 ** 31).to.not.conform(integerCodec.specForIdentifier);
    expect(-(2 ** 31) - 1).to.not.conform(integerCodec.specForIdentifier);
    expect(Number.NaN).to.not.conform(integerCodec.specForIdentifier);
  });

  it("supports encoding", () => {
    const value = -205;
    const actual = integerCodec.encode(value);
    expect(actual).to.equal(value);
  });

  it("validates good decoded values", () => {
    expect(2).to.conform(integerCodec.specForDecoding);
    expect(-4003).to.conform(integerCodec.specForDecoding);
  });

  it("rejects decoding bad values", () => {
    expect("happiness").to.not.conform(integerCodec.specForDecoding);
    expect(12.44).to.not.conform(integerCodec.specForDecoding);
    expect(2 ** 32).to.not.conform(integerCodec.specForDecoding);
  });

  it("supports decoding", () => {
    const value = 35957;
    const actual = integerCodec.decode(value);
    expect(actual).to.equal(value);
  });
});