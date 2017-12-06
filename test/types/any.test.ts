import {expect} from "chai";

import {anyCodec} from "../../src/types/any";

describe("any codec", () => {
  const anyValues = ["barter", true, -23.3];

  it("validates known good values", () => {
    anyValues.forEach((value) => {
      expect(() => anyCodec.validateForIdentifier(value)).to.not.throw();
    });
  });

  it("encodes good values", () => {
    anyValues.forEach((value) => {
      const actual = anyCodec.encode(value);
      expect(actual).to.equal(value);
    });
  });

  const anyFailureValues = [undefined, null, /.+/, [-23.3], {a: "b"}, Symbol.for("nope")];
  it("rejects bad values for an identifier", () => {
    anyFailureValues.forEach((value) => {
      expect(() => anyCodec.validateForIdentifier(value)).to.throw();
    });
  });

  it("supports decoding", () => {
    anyValues.forEach((value) => {
      expect(() => anyCodec.validateForDecoding(value)).to.not.throw();
      const actual = anyCodec.decode(value);
      expect(actual).to.equal(value);
    });
  });

  it("validates decoding good values", () => {
    anyValues.forEach((value) => {
      const actual = anyCodec.decode(value);
      expect(actual).to.equal(value);
    });
  });

  it("rejects decoding non-values", () => {
    anyFailureValues.forEach((value) => {
      expect(() => anyCodec.validateForDecoding(value)).to.throw();
    });
  });
});