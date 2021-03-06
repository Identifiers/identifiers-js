import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
import * as S from "js.spec";
import {bytesCodec} from "../../src/types/bytes";

chai.use(jsSpecChai);

describe("bytes codec", () => {
  it("validates good identifier values", () => {
    expect([1, 66]).to.conform(bytesCodec.specForIdentifier);
    expect(Uint8Array.of(88, 255)).to.conform(bytesCodec.specForIdentifier);
    expect(Uint8ClampedArray.of(88, 255)).to.conform(bytesCodec.specForIdentifier);
    expect(new ArrayBuffer(0)).to.conform(bytesCodec.specForIdentifier);
    expect({length: 2, 0: 1, "1": 75}).to.conform(bytesCodec.specForIdentifier);
  });

  it("rejects bad identifier values", () => {
    expect("fail").to.not.conform(bytesCodec.specForIdentifier);
    expect(Array.from("Fail")).to.not.conform(bytesCodec.specForIdentifier);
    expect([-11, 66]).to.not.conform(bytesCodec.specForIdentifier);
    // huge array cannot be converted to JSON so need to test with S.valid
    expect(S.valid(bytesCodec.specForIdentifier, new Array(2 ** 31))).to.be.false;
    expect({length: false, "0": 1}).to.not.conform(bytesCodec.specForIdentifier);
    expect({length: 2, 0: 1, 1: false}).to.not.conform(bytesCodec.specForIdentifier);
  });

  it("supports encoding", () => {
    const value = [1, 2, 3];
    const actual = bytesCodec.encode(value);
    expect(actual).to.be.an("uint8array");
    expect(actual).to.deep.equal(new Uint8Array(value));
  });

  it("validates good decoded values", () => {
    const value = new Uint8Array([1, 255]);
    expect(value).to.conform(bytesCodec.specForDecoding);
  });

  it("rejects decoding bad values", () => {
    const value = [1, 255];
    expect(value).to.not.conform(bytesCodec.specForDecoding);
  });

  it("supports decoding", () => {
    const value = [77, 66, 55];
    const actual = bytesCodec.decode(Uint8Array.from(value));
    expect(actual).to.deep.equal(value);
  });
});
