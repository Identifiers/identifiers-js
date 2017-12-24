import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
chai.use(jsSpecChai);

import {anyCodec} from "../../src/types/any";


describe("any codec", () => {
  const anyValues = ["barter", true, -23.3];
  const anyFailureValues = [undefined, null, /.+/, [-23.3], {a: "b"}];

  it("validates good values for identifier", () => {
    anyValues.forEach((value) =>
      expect(value).to.conform(anyCodec.specForIdentifier));
  });

  it("rejects bad identifier values", () => {
    anyFailureValues.forEach((value) =>
      expect(value).to.not.conform(anyCodec.specForIdentifier));
  });

  it("supports encoding", () => {
    anyValues.forEach((value) => {
      const actual = anyCodec.encode(value);
      expect(actual).to.equal(value)
    });
  });

  it("validates good decoded values", () => {
    anyValues.forEach((value) =>
      expect(value).to.conform(anyCodec.specForDecoding));
  });

  it("rejects decoding bad values", () => {
    anyFailureValues.forEach((value) =>
      expect(value).to.not.conform(anyCodec.specForDecoding));
  });

  it("supports decoding", () => {
    anyValues.forEach((value) => {
      const actual = anyCodec.decode(value);
      expect(actual).to.equal(value)
    });
  });
});