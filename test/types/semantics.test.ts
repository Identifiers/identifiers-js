import {expect} from "chai";

import {datetimeCodec} from "../../src/types/semantics";

describe("semantic codecs", () => {

  describe("datetime codec", () => {
    it("supports encoding", () => {
      const value = new Date();
      expect(() => datetimeCodec.validateForIdentifier(value)).to.not.throw();
      expect(() => datetimeCodec.validateForIdentifier(33779563)).to.not.throw();
      const actual = datetimeCodec.encode(value);
      expect(actual).to.equal(value.getTime());
    });

    it("supports decoding", () => {
      const value = new Date().getTime();
      expect(() => datetimeCodec.validateForDecoding(value)).to.not.throw();
      expect(() => datetimeCodec.validateForDecoding(new Date())).to.throw();
      expect(() => datetimeCodec.validateForDecoding("not a number")).to.throw();
      const actual = datetimeCodec.decode(value);
      expect(actual.getTime()).to.deep.equal(value);
    });
  });
});