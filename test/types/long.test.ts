import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
chai.use(jsSpecChai);

import {Int64BE} from "int64-buffer";

import {longCodec} from "../../src/types/long";
import {symbol} from "js.spec";
import minCount = symbol.minCount;
import {MAX_INT, MIN_INT} from "../../src/types/integer";


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
      let actual = longCodec.encode({high: 0, low: MAX_INT});
      expect(actual).equals(MAX_INT);

      actual = longCodec.encode({high: -1, low: MIN_INT});
      expect(actual).equals(MIN_INT);
    });

    it("supports encoding larger numbers", () => {
      const value = {high: 4221, low: 3};
      const actual = longCodec.encode(value) as Int64BE;
      expect(Int64BE.isInt64BE(actual)).to.be.true;
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
