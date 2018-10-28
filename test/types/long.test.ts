import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
chai.use(jsSpecChai);

import {longCodec} from "../../src/types/long";
import * as Long from "long";


describe("long codec", () => {
  describe("individual longs", () => {
    it("validates good identifier values", () => {
      expect(77).to.conform(longCodec.specForIdentifier);
      expect({high: 21, low: 9843}).to.conform(longCodec.specForIdentifier);
      expect(Long.fromNumber(1, true)).to.conform(longCodec.specForIdentifier);
    });

    it("rejects bad identifier values", () => {
      expect("55").to.not.conform(longCodec.specForIdentifier);
      expect(false).to.not.conform(longCodec.specForIdentifier);
      expect(Number.NaN).to.not.conform(longCodec.specForIdentifier);
    });

    it("supports encoding 32-bit numbers", () => {
      const maxInt = 0x7fffffff;
      let actual = longCodec.encode(Long.fromNumber(maxInt)) as Long;
      expect(actual.low).equals(maxInt);

      const minInt = -0x80000000;
      actual = longCodec.encode(Long.fromNumber(minInt)) as Long;
      expect(actual.low).equals(minInt);
    });

    it("supports encoding larger numbers", () => {
      const actualNeg = longCodec.encode(Long.fromNumber(Number.MIN_SAFE_INTEGER)) as Long;
      expect(Long.isLong(actualNeg)).to.be.true;
      expect(actualNeg.toBytesBE()).to.contain.ordered.members([255, 224, 0, 0, 0, 0, 0, 1]);

      const actualPos = longCodec.encode(Long.fromNumber(Number.MAX_SAFE_INTEGER)) as Long;
      expect(Long.isLong(actualPos)).to.be.true;
      expect(actualPos.toBytesBE()).to.contain.ordered.members([0, 31, 255, 255, 255, 255, 255, 255]);

      const value = Long.fromBits(3, 4221);
      const actual = longCodec.encode(value) as Long;
      expect(Long.isLong(actual)).to.be.true;
      expect(actual.toBytesBE()).to.contain.ordered.members([0, 0, 16, 125, 0, 0, 0, 3]);
    });

    it("validates good decoded values", () => {
      expect(1999).to.conform(longCodec.specForDecoding);
      expect(new Long(1797574472988)).to.conform(longCodec.specForDecoding);
    });

    it("supports decoding numbers", () => {
      const value = 37;
      const actual = longCodec.decode(value);
      expect(actual).to.deep.equal(new Long(37));
    });

    it("supports decoding Long", () => {
      const value = Long.fromNumber(77975744723112);
      const actual = longCodec.decode(value);
      expect(actual).to.deep.equal(Long.fromBits(613464232, 18155));
    });
  });
});
