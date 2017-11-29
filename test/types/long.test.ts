import {expect} from "chai";
import * as Long from "long";

import {longCodec, longListCodec} from "../../src/types/long";
import {Int64BE} from "int64-buffer";


describe("long codec", () => {
  describe("individual longs", () => {
    it("supports encoding long-like objects", () => {
      const value = Long.fromNumber(83447645763839);
      expect(() => longCodec.validateForIdentifier(value)).to.not.throw();
      const actual: Int64BE = longCodec.encode(value);
      expect(actual.toNumber()).equals(value.toNumber());
    });

    it("supports encoding numbers", () => {
      const value = Long.fromNumber(4);
      expect(() => longCodec.validateForIdentifier(value)).to.not.throw();
      const actual = longCodec.encode(value);
      expect(actual).equals(value.low);
    });

    it("supports decoding numbers", () => {
      const value = 37;
      expect(() => longCodec.validateForDecoding(value)).to.not.throw();
      const actual = longCodec.decode(value);
      expect(actual).to.deep.equal({high: 0, low: 37});
    });

    it("supports decoding Int64BE", () => {
      const value = new Int64BE(77975744723112);
      expect(() => longCodec.validateForDecoding(value)).to.not.throw();
      const actual = longCodec.decode(value);
      expect(actual).to.deep.equal({high: 18155, low: 613464232});
    });
  });

  describe("list of longs", () => {
    //todo more tests
    it("supports encoding mixed types of longs", () => {
      const values = [1, 2, Long.fromNumber(2 ** 60)];
      expect(() => longListCodec.validateForIdentifier(values)).to.not.throw();
      const actual = longListCodec.encode(values);
      expect(actual).to.contain.ordered.members(values);
    });
  });
});
