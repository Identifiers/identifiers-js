import {expect} from "chai";
import * as S from "js.spec";

import {createListCodec, LIST_TYPE_CODE} from "../../src/types/lists";
import {IdentifierCodec} from "../../src/identifier";


const spy = {
  vfi: 0,
  fi: 0,
  e: 0,
  vfd: 0,
  d: 0,
  is: 0,
  reset: function() {
    this.vfi = this.fi = this.e = this.vfd = this.d = this.is = 0;
  }
};

describe("create a list codec from an item codec", () => {
  describe("created list codec", () => {
    const itemCodec: IdentifierCodec =  {
      typeCode: 1000,
      type: "test",
      //not used. I wonder if that's a good idea. Perhaps the list spec should apply this fn
      validateForIdentifier: (value) => {spy.vfi++;},
      forIdentifier: (value) => {spy.fi++; return value + 1;},
      encode: (value) => {spy.e++; return value + 1;},
      validateForDecoding: (value) => {spy.vfd++;},
      decode: (value) => {spy.d++; return value + 1;}
    };
    const codecUnderTest = createListCodec(itemCodec, S.spec.and("item spec", (value) => {spy.is++; return true;}));

    const values = [1, 2, 3];

    it("has the correct type and typeCode", () => {
      expect(codecUnderTest.type).to.equal(`${itemCodec.type}-list`);
      expect(codecUnderTest.typeCode).to.equal(itemCodec.typeCode | LIST_TYPE_CODE);
    });

    it("validates a list of values", () => {
      spy.reset();
      codecUnderTest.validateForIdentifier(values);
      expect(spy.is).to.equal(3);
    });

    it("uses forIdentifier on a list of values", () => {
      spy.reset();
      const actual = codecUnderTest.forIdentifier(values);
      expect(spy.fi).to.equal(3);
      expect(actual).to.contain.ordered.members([2, 3, 4]);
    });

    it("encodes a list of values", () => {
      spy.reset();
      const actual = codecUnderTest.encode(values);
      expect(spy.e).to.equal(3);
      expect(actual).to.contain.ordered.members([2, 3, 4]);
    });
  });
});

//todo  more tests--just run coverage with this one test and see how lists.ts is covered