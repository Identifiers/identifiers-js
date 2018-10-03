import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
chai.use(jsSpecChai);

import {Int64, Int64BE, Uint64BE} from "int64-buffer";

import {longCodec} from "../../src/types/long";
import * as Long from "long";


describe("long codec", () => {
  describe("individual longs", () => {
    it("validates good identifier values", () => {
      expect(77).to.conform(longCodec.specForIdentifier);
      expect({high: 21, low: 9843}).to.conform(longCodec.specForIdentifier);
    });

    it("rejects bad identifier values", () => {
      expect("55").to.not.conform(longCodec.specForIdentifier);
      expect(false).to.not.conform(longCodec.specForIdentifier);
      expect(Number.NaN).to.not.conform(longCodec.specForIdentifier);
    });

    it("supports encoding 32-bit numbers", () => {
      const maxInt = 0x7fffffff;
      let actual = longCodec.encode({high: 0, low: maxInt});
      expect(actual).equals(maxInt);

      const minInt = -0x80000000;
      actual = longCodec.encode({high: -1, low: minInt});
      expect(actual).equals(minInt);
    });

    it("supports encoding larger numbers", () => {
      const actualPos = longCodec.encode(Long.fromNumber(Number.MAX_SAFE_INTEGER)) as Int64;
      expect(Uint64BE.isUint64BE(actualPos)).to.be.true;
      expect(actualPos.toArray()).to.contain.ordered.members([0, 31, 255, 255, 255, 255, 255, 255]);

      const actualNeg = longCodec.encode(Long.fromNumber(Number.MIN_SAFE_INTEGER)) as Int64;
      expect(Int64BE.isInt64BE(actualNeg)).to.be.true;
      expect(actualNeg.toArray()).to.contain.ordered.members([255, 224, 0, 0, 0, 0, 0, 1]);

      const value = {high: 4221, low: 3};
      const actual = longCodec.encode(value) as Int64;
      expect(Uint64BE.isUint64BE(actual)).to.be.true;
      expect(actual.toArray()).to.contain.ordered.members([0, 0, 16, 125, 0, 0, 0, 3]);
    });

    it("validates good decoded values", () => {
      expect(1999).to.conform(longCodec.specForDecoding);
      expect(new Int64BE(1797574472988)).to.conform(longCodec.specForDecoding);
    });

    it("supports decoding numbers", () => {
      const value = 37;
      const actual = longCodec.decode(value);
      expect(actual).to.deep.equal({high: 0, low: 37});
    });

    it("supports decoding Int64BE", () => {
      const value = new Int64BE(77975744723112);
      const actual = longCodec.decode(value);
      expect(actual).to.deep.equal({high: 18155, low: 613464232});
    });
  });
});
