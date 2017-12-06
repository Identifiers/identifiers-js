import {expect} from "chai";

import {anyCodec} from "../../src/types/any";

describe("any codec", () => {
  const anyValues = ["barter", true, -23.3];
  const anyFailureValues = [undefined, null, /.+/, [-23.3], {a: "b"}, Symbol.for("nope")];

  it("validates good values for identifier", () => {
    anyValues.forEach((value) => {
      expect(() => anyCodec.validateForIdentifier(value)).to.not.throw();
    });
  });

  it("rejects bad identifier values", () => {
    anyFailureValues.forEach((value) => {
      expect(() => anyCodec.validateForIdentifier(value)).to.throw();
    });
  });

  it("supports encoding", () => {
    anyValues.forEach((value) => {
      const actual = anyCodec.encode(value);
      expect(actual).to.equal(value);
    });
  });

  it("validates good decoded values", () => {
    anyValues.forEach((value) => {
      expect(() => anyCodec.validateForDecoding(value)).to.not.throw();
    });
  });

  it("rejects decoding bad values", () => {
    anyFailureValues.forEach((value) => {
      expect(() => anyCodec.validateForDecoding(value)).to.throw();
    });
  });

  it("supports decoding", () => {
    anyValues.forEach((value) => {
      const actual = anyCodec.decode(value);
      expect(actual).to.equal(value);
    });
  });
});