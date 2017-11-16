import {expect} from "chai";

import {datetimeCodec} from "../../src/codecs/semantics";

describe("semantic codecs", () => {

  describe("datetime codec", () => {
    it("supports encoding", () => {
      const value = new Date();
      expect(() => datetimeCodec.validateForEncoding(value)).to.not.throw;
      expect(() => datetimeCodec.validateForEncoding("not a date")).to.throw;
      const actual = datetimeCodec.encode(value);
      expect(actual).to.equal(value.getTime());
    });

    it("supports decoding", () => {
      const value = new Date();
      expect(() => datetimeCodec.validateForDecoding(value)).to.not.throw;
      expect(() => datetimeCodec.validateForDecoding("not a date")).to.throw;
      const actual = datetimeCodec.decode(value);
      expect(actual).to.deep.equal(value);
    });
  });
});