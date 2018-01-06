import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
import {bytesInputSpec} from "../../src/types/bytes";

chai.use(jsSpecChai);

describe("bytes codec", () => {
  it("validates good identifier values", () => {
    expect([1, 66]).to.conform(bytesInputSpec);
    expect(Uint8Array.of(88, 255)).to.conform(bytesInputSpec);
    expect(new ArrayBuffer(0)).to.conform(bytesInputSpec);
  });
});