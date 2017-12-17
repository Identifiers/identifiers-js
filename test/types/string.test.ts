import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";

chai.use(jsSpecChai);

import {stringCodec} from "../../src/types/string";


describe("string codec", () => {
  it("validates good identifier values", () => {
    expect("maximus").to.conform(stringCodec.specForIdentifier);
    expect("").to.conform(stringCodec.specForIdentifier);
  });

  it("rejects bad identifier values", () => {
    expect(false).to.not.conform(stringCodec.specForIdentifier);
    expect(1).to.not.conform(stringCodec.specForIdentifier);
    expect(null).to.not.conform(stringCodec.specForIdentifier);
  });

  it("supports encoding", () => {
    const value = "ships";
    const actual = stringCodec.encode(value);
    expect(actual).to.equal(value);
  });

  it("validates good decoded values", () => {
    expect("flavius").to.conform(stringCodec.specForDecoding);
    expect("").to.conform(stringCodec.specForDecoding);
  });

  it("rejects decoding bad values", () => {
    expect(new Date()).to.conform(stringCodec.specForDecoding);
    expect(null).to.conform(stringCodec.specForDecoding);

    it("supports decoding", () => {
      const value = "ballast";
      const actual = stringCodec.decode(value);
      expect(actual).to.equal(value);
    });
  });
});