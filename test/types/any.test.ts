import {expect} from "chai";

import {anyCodec} from "../../src/types/any";


describe("any codec", () => {
  const anyValues = ["barter", true, -23.3];
  it("supports encoding", () => {
    anyValues.forEach((value) => {
      expect(() => anyCodec.validateForIdentifier(value)).to.not.throw();
      const actual = anyCodec.encode(value);
      expect(actual).to.equal(value);
    });
  });

  const anyFailureValues = [undefined, null, /.+/, [-23.3], {a: "b"}, Symbol.for("nope")];
  it("rejects encoding non-values", () => {
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

  it("rejects decoding non-values", () => {
    anyFailureValues.forEach((value) => {
      expect(() => anyCodec.validateForDecoding(value)).to.throw();
    });
  });
});