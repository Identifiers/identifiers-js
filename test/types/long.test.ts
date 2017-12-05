import {expect} from "chai";
import * as Long from "long";

import {longCodec, longListCodec} from "../../src/types/long";
import {Int64BE} from "int64-buffer";


describe("long codec", () => {
  describe("individual longs", () => {
    it("supports encoding long-like objects", () => {
      const value = {high: 21, low: 9843};
      expect(() => longCodec.validateForIdentifier(value)).to.not.throw();
      const actual = longCodec.encode(value);
      expect(actual.toArray()).to.contain.ordered.members([0, 0, 0, 21, 0, 0, 38, 115]);
    });

    it("supports encoding numbers", () => {
      const value = 4;
      expect(() => longCodec.validateForIdentifier(value)).to.not.throw();
      const actual = longCodec.encode(longCodec.forIdentifier(value));
      expect(actual).equals(value);
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
    it("supports encoding mixed types of longs", () => {
      const values = longListCodec.forIdentifier([1, 2, Long.fromNumber(2 ** 60)]);
      expect(() => longListCodec.validateForIdentifier(values)).to.not.throw();
      const actual = longListCodec.encode(values);
      const v3 = values[2];
      expect(actual).to.contain.deep.ordered.members([1, 2, new Int64BE(v3.high, v3.low)]);
    });

    it("supports decoding mixed types of longs", () => {
      const values = [77, -2994, new Int64BE(2 ** 62)];
      expect(() => longListCodec.validateForDecoding(values)).to.not.throw();
      const actual = longListCodec.decode(values);
      expect(actual).to.contain.deep.ordered.members([
        {high: 0, low: 77},
        {high: 0, low: -2994},
        {high: 1073741824, low: 0}
      ]);
    });
  });
});
