import {expect} from "chai";
import * as S from "js.spec";

import {calculateListTypeCode, createListCodec, LIST_OF, LIST_TYPE_CODE} from "../../src/types/lists";
import {IdentifierCodec} from "../../src/identifier-codec";
import {MAP_OF, MAP_TYPE_CODE} from "../../src/types/maps";
import {asIsCodec} from "../../src/types/shared-types";


const spy = {
  sfi: 0,
  fi: 0,
  e: 0,
  sfd: 0,
  d: 0,
  reset: function() {
    this.sfi = this.fi = this.e = this.sfd = this.d = 0;
  }
};

describe("create a list codec from an item codec", () => {
  describe("created list codec", () => {
    const itemCodec: IdentifierCodec<number> =  {
      typeCode: 7,
      type: "test",
      specForIdentifier: S.spec.and("spy forIdentifier", () => !!++spy.sfi),
      forIdentifier: (value) => {++spy.fi; return value + 1;},
      encode: (value) => {++spy.e; return value + 1;},
      toDebugString: asIsCodec.toDebugString,
      specForDecoding: S.spec.and("spy forDecoding", () => !!++spy.sfd),
      decode: (value) => {++spy.d; return value - 1;}
    };
    const codecUnderTest = createListCodec(itemCodec);

    const values = [1, 2, 3];
    const expected = [2, 3, 4];

    it("has the correct type and typeCode", () => {
      expect(codecUnderTest.type).to.equal(`${itemCodec.type}-list`);
      expect(codecUnderTest.typeCode).to.equal(itemCodec.typeCode | LIST_TYPE_CODE);
    });

    it("rejects null lists for identifier", () => {
      spy.reset();
      expect(S.valid(codecUnderTest.specForIdentifier, null)).to.equal(false);
    });

    it("accepts empty list for identifier", () => {
      spy.reset();
      expect(S.valid(codecUnderTest.specForIdentifier, values)).to.equal(true);
      expect(spy.sfi).to.equal(3);
    });

    it("validates a list of values for identifier", () => {
      spy.reset();
      expect(S.valid(codecUnderTest.specForIdentifier, values)).to.equal(true);
      expect(spy.sfi).to.equal(3);
    });

    it("uses forIdentifier on a list of values", () => {
      spy.reset();
      const actual = codecUnderTest.forIdentifier(values);
      expect(spy.fi).to.equal(3);
      expect(actual).to.contain.ordered.members(expected);
    });

    it("encodes a list of values", () => {
      spy.reset();
      const actual = codecUnderTest.encode(values);
      expect(spy.e).to.equal(3);
      expect(actual).to.contain.ordered.members(expected);
    });

    it("validates a list of values for decoding", () => {
      spy.reset();
      expect(S.valid(codecUnderTest.specForDecoding, values)).to.equal(true);
      expect(spy.sfd).to.equal(3);
    });

    it("decodes a list of values", () => {
      spy.reset();
      const actual = codecUnderTest.decode(values);
      expect(spy.d).to.equal(3);
      expect(actual).to.contain.ordered.members([0, 1, 2]);
    });

    it("rejects null list for decoding", () => {
      spy.reset();
      expect(S.valid(codecUnderTest.specForDecoding, null)).to.equal(false);
    });

    it("generates a debug string", () => {
      const actual = codecUnderTest.toDebugString([1, 2]);
      expect(actual).to.equal("[1, 2]");
    });
  });
});

describe("list typeCode calculation", () => {
  it("correctly calculates the typeCode from a primitive typeCode", () => {
    const actual = calculateListTypeCode(1);
    expect (actual).to.equal(1 | LIST_TYPE_CODE);
  });

  it("correctly calculates a list-of-lists typeCode from a list typeCode", () => {
    const listTypeCode = 1 | LIST_TYPE_CODE;
    const actual = calculateListTypeCode(listTypeCode);
    expect (actual).to.equal(listTypeCode | LIST_OF);
  });

  it("correctly calculates a list-of-maps typeCode from a map typeCode", () => {
    const mapTypeCode = 1 | MAP_TYPE_CODE;
    const actual = calculateListTypeCode(mapTypeCode);
    expect (actual).to.equal(mapTypeCode | LIST_OF);
  });

  it("throws an error when a list-of is passed in", () => {
    expect(() => calculateListTypeCode(LIST_OF)).to.throw("Cannot create a List of List of something.");
  });

  it("throws an error when a map-of is passed in", () => {
    expect(() => calculateListTypeCode(MAP_OF)).to.throw("Cannot create a List of Map of something.");
  });
});