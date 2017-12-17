import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
chai.use(jsSpecChai);

import {booleanCodec} from "../../src/types/boolean";


describe("boolean codec", () => {
  it("validates good identifier values", () => {
    expect(true).to.conform(booleanCodec.specForIdentifier);
    expect(false).to.conform(booleanCodec.specForIdentifier);
  });

  it("rejects bad identifier values", () => {
    expect(1).to.not.conform(booleanCodec.specForIdentifier);
    expect(null).to.not.conform(booleanCodec.specForIdentifier);
  });

  it("supports encoding", () => {
    const value = false;
    const actual = booleanCodec.encode(value);
    expect(actual).to.equal(value);
  });

  it("validates good decoded values", () => {
    expect(true).to.conform(booleanCodec.specForDecoding);
    expect(false).to.conform(booleanCodec.specForDecoding);
  });

  it("rejects decoding bad values", () => {
    expect(0).to.not.conform(booleanCodec.specForDecoding);
    expect("false").to.not.conform(booleanCodec.specForDecoding);
    expect(null).to.not.conform(booleanCodec.specForDecoding);
  });

  it("supports decoding", () => {
    const value = true;
    const actual = booleanCodec.decode(value);
    expect(actual).to.equal(value);
  });
});