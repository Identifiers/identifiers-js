import {expect} from "chai";
import * as S from "js.spec";

import {calculateListTypeCode, createListCodec, LIST_OF_LISTS, LIST_OF_MAPS, LIST_TYPE_CODE} from "../../src/types/lists";
import {IdentifierCodec} from "../../src/identifier-codec";
import {MAP_TYPE_CODE} from "../../src/types/maps";
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
      specForIdentifier: S.spec.and("spy forIdentifier", (value) => {spy.sfi++; return true;}),
      forIdentifier: (value) => {spy.fi++; return value + 1;},
      encode: (value) => {spy.e++; return value + 1;},
      toDebugString: asIsCodec.toDebugString,
      specForDecoding: S.spec.and("spy forDecoding", (value) => {spy.sfd++; return true;}),
      decode: (value) => {spy.d++; return value - 1;}
    };
    const codecUnderTest = createListCodec(itemCodec);

    const values = [1, 2, 3];
    const expected = [2, 3, 4];

    it("has the correct type and typeCode", () => {
      expect(codecUnderTest.type).to.equal(`${itemCodec.type}-list`);
      expect(codecUnderTest.typeCode).to.equal(itemCodec.typeCode | LIST_TYPE_CODE);
    });

    it("rejects nul lists for identifier", () => {
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
    expect (actual).to.equal(listTypeCode | LIST_OF_LISTS);
  });

  it("correctly calculates a list-of-maps typeCode from a map typeCode", () => {
    const mapTypeCode = 1 | MAP_TYPE_CODE;
    const actual = calculateListTypeCode(mapTypeCode);
    expect (actual).to.equal(mapTypeCode | LIST_OF_MAPS);
  });

  it("throws an error when a list-of-lists is passed in", () => {
    const listOfLists = 1 | LIST_OF_LISTS;
    expect(() => calculateListTypeCode(listOfLists)).to.throw("Cannot create a List of List of Lists.");
  });

  it("throws an error when a list-of-maps is passed in", () => {
    const listOfMaps = 1 | LIST_OF_MAPS;
    expect(() => calculateListTypeCode(listOfMaps)).to.throw("Cannot create a List of List of Maps.");
  });
});