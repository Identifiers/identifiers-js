import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
chai.use(jsSpecChai);

import {floatCodec} from "../../src/types/float";


describe("float codec", () => {
  it("validates good identifier values", () => {
    expect(100).to.conform(floatCodec.specForIdentifier);
    expect(-12984.76).to.conform(floatCodec.specForIdentifier);
  });

  it("rejects bad identifier values", () => {
    expect(false).to.not.conform(floatCodec.specForIdentifier);
    expect("200.23").to.not.conform(floatCodec.specForIdentifier);
    expect(Number.NaN).to.not.conform(floatCodec.specForIdentifier);
  });

  it("supports encoding", () => {
    const value = 22.5001;
    const actual = floatCodec.encode(value);
    expect(actual).to.equal(value);
  });

  it("validates good decoded values", () => {
    expect(4556).to.conform(floatCodec.specForDecoding);
    expect(-885932.2).to.conform(floatCodec.specForDecoding);
  });

  it("rejects decoding bad values", () => {
    expect(true).to.not.conform(floatCodec.specForDecoding);
    expect("-883.22").to.not.conform(floatCodec.specForDecoding);
  });

  it("supports decoding", () => {
    const value = -3.114;
    const actual = floatCodec.decode(value);
    expect(actual).to.equal(value);
  });
});