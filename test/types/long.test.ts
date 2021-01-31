import * as S from "js.spec";
import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
chai.use(jsSpecChai);

import {longCodec} from "../../src/types/long";
import * as Long from "long";
import {isBigInt} from "../../src/shared";


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
      expect(Long.fromNumber(1, true)).to.not.conform(longCodec.specForIdentifier);
    });

    it("supports encoding 32-bit numbers", () => {
      const maxInt = 0x7fffffffn;
      let actual = longCodec.encode(maxInt);
      expect(actual).equals(maxInt);

      const minInt = -0x80000000n;
      actual = longCodec.encode(minInt);
      expect(actual).equals(minInt);
    });

    it("supports encoding larger numbers", () => {
      const actualNeg = longCodec.encode(BigInt(Number.MIN_SAFE_INTEGER));
      expect(isBigInt(actualNeg)).to.be.true;
      expect(actualNeg.toString(16)).equals("-1fffffffffffff");

      const actualPos = longCodec.encode(BigInt(Number.MAX_SAFE_INTEGER));
      expect(isBigInt(actualPos)).to.be.true;
      expect(actualPos.toString(16)).equals("1fffffffffffff");

      // 64-bit signed
      const minPos = -0x8000000000000000n;
      const actualMin = longCodec.encode(minPos);
      expect(isBigInt(actualMin)).to.be.true;
      expect(actualMin.toString(16)).equals("-8000000000000000");

      const maxPos = 0x7fffffffffffffffn;
      const actualMax = longCodec.encode(maxPos);
      expect(isBigInt(actualMax)).to.be.true;
      expect(actualMax.toString(16)).equals("7fffffffffffffff");
    });

    it("rejects bigint values that are out of range", () => {
      // js-spec can't create errors from BigInt values so cannot use conform()
      expect (() => S.assert(longCodec.specForIdentifier, 0x8000000000000000n)).to.throw();
      expect (() => S.assert(longCodec.specForIdentifier, -0x8000000000000001n)).to.throw();
    });

    it("validates good decoded values", () => {
      expect(1999).to.conform(longCodec.specForDecoding);
      // js-spec can't create errors from BigInt values so cannot use conform()
      expect (() => S.assert(longCodec.specForDecoding, -0x8000000000000000n)).to.not.throw();
    });

    it("supports decoding numbers", () => {
      const value = 37;
      const actual = longCodec.decode(value);
      expect(actual).equals(BigInt(value));
    });

    it("supports decoding bigints", () => {
      const value = 77975744723112n;
      const actual = longCodec.decode(value);
      expect(actual).equals(value);
    });

    it("generates a debug string", () => {
      const value = -66758543n;
      const actual = longCodec.toDebugString(value);
      expect(actual).to.equal(value.toString());
    });
  });
});
