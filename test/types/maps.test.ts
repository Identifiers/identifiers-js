import {expect} from "chai";
import * as S from "js.spec";

import {createMapCodec, MAP_TYPE_CODE} from "../../src/types/maps";
import {IdentifierCodec} from "../../src/identifier-codec";
import {stringCodec} from "../../src/types/string";
import {asIsCodec} from "../../src/types/shared-types";


describe("create a map codec from an item codec", () => {
  const spy = {
    sfi: 0,
    fi: 0,
    e: 0,
    sfd: 0,
    d: 0,
    reset: function () {
      this.sfi = this.fi = this.e = this.sfd = this.d = 0;
    }
  };

  describe("test for correct usage of item codec", () => {
    const itemCodec: IdentifierCodec<number> =  {
      typeCode: 1000,
      type: "test",
      specForIdentifier: S.spec.and("spy forIdentifier",
        (value) => value !== Number.MAX_VALUE,
        (value) => {spy.sfi++; return true;}),
      forIdentifier: (value) => {spy.fi++; return value + 1;},
      encode: (value) => {spy.e++; return value + 1;},
      toDebugString: asIsCodec.toDebugString,
      specForDecoding: S.spec.and("spy forDecoding", (value) => {spy.sfd++; return true;}),
      decode: (value) => {spy.d++; return value - 1;}
    };
    const codecUnderTest = createMapCodec(itemCodec);

    const values = {a: 1, b: 2, c: 3};
    const expected = {a: 2, b: 3, c: 4};

    it("has the correct type and typeCode", () => {
      expect(codecUnderTest.type).to.equal(`${itemCodec.type}-map`);
      expect(codecUnderTest.typeCode).to.equal(itemCodec.typeCode | MAP_TYPE_CODE);
    });

    it("rejects null map for identifier", () => {
      spy.reset();
      expect(S.valid(codecUnderTest.specForIdentifier, null)).to.equal(false);
    });

    it("accepts empty map for identifier", () => {
      spy.reset();
      expect(S.valid(codecUnderTest.specForIdentifier, {})).to.equal(true);
    });

    it("rejects maps with invalid values", () => {
      spy.reset();
      expect(S.valid(codecUnderTest.specForIdentifier, {a: Number.MAX_VALUE})).to.equal(false);
    });

    it("validates a map of values for identifier", () => {
      spy.reset();
      expect(S.valid(codecUnderTest.specForIdentifier, values)).to.equal(true);
      expect(spy.sfi).to.equal(3);
    });

    it("uses forIdentifier on a map of values", () => {
      spy.reset();
      const actual = codecUnderTest.forIdentifier(values);
      expect(spy.fi).to.equal(3);
      expect(actual).to.contain(expected);
    });

    it("encodes a map of values", () => {
      spy.reset();
      const actual = codecUnderTest.encode(values);
      expect(spy.e).to.equal(3);
      expect(actual).to.contain(expected);
    });

    it("validates a map of values for decoding", () => {
      spy.reset();
      expect(S.valid(codecUnderTest.specForDecoding, values)).to.equal(true);
      expect(spy.sfd).to.equal(3);
    });

    it("decodes a map of values", () => {
      spy.reset();
      const actual = codecUnderTest.decode(values);
      expect(spy.d).to.equal(3);
      expect(actual).to.contain({a: 0, b: 1, c: 2});
    });

    it("rejects null maps for decoding", () => {
      spy.reset();
      expect(S.valid(codecUnderTest.specForDecoding, null)).to.equal(false);
    });
  });
});

describe("map codec", () => {
  it("correctly encodes a map with different-ordered keys", () => {
    const codecUnderTest = createMapCodec(stringCodec);
    const value = {b: "there", a: "hi"};
    const value2 = codecUnderTest.forIdentifier(value);
    const actual2 = codecUnderTest.encode(value2);

    expect(Object.keys(actual2)).to.have.ordered.members(["a", "b"]);
  });
});

describe("MapValuesSpec", () => {
  it("explains failures in mapped value spec", () => {
    const specUnderTest = createMapCodec(stringCodec).specForIdentifier;
    const actual = S.explainStr(specUnderTest, {a: 1});
    expect(actual).to.contain("string spec: isString failed for 1 at [a].");
  });
});