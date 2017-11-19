import {expect} from "chai";
import * as Long from "long";

import {anyCodec, booleanCodec, floatCodec, integerCodec, longCodec, stringCodec} from "../../src/types/primitives";

// todo: more tests around forIdentifier validation. these are currently muddled together

describe("primitive codecs for identifier values", () => {

  describe("any codec", () => {
    const anyValues = ["barter", true, null, /.+/, -23.3, {a: "b"}];
    it("supports encoding", () => {
      anyValues.forEach((value) => {
        expect(() => anyCodec.validateForIdentifier(value)).to.not.throw();
        const actual = anyCodec.encode(value);
        expect(actual).to.equal(value);
      });
    });

    it("rejects encoding non-values", () => {
      expect(() => anyCodec.validateForIdentifier(undefined)).to.throw();
      expect(() => anyCodec.validateForIdentifier(() => true)).to.throw();
      expect(() => anyCodec.validateForIdentifier(Symbol.for("nope"))).to.throw();
    });

    it("supports decoding", () => {
      anyValues.forEach((value) => {
        expect(() => anyCodec.validateForDecoding(value)).to.not.throw();
        const actual = anyCodec.decode(value);
        expect(actual).to.equal(value);
      });
    });

    it("rejects decoding non-values", () => {
      expect(() => anyCodec.validateForDecoding(undefined)).to.throw();
      expect(() => anyCodec.validateForDecoding(() => true)).to.throw();
      expect(() => anyCodec.validateForDecoding(Symbol.for("nope"))).to.throw();
    });
  });

  describe("string codec", () => {
    it("supports encoding", () => {
      const value = "ballast";
      expect(() => stringCodec.validateForIdentifier(value)).to.not.throw();
      expect(() => stringCodec.validateForIdentifier(1)).to.throw();
      const actual = stringCodec.encode(value);
      expect(actual).to.equal(value);
    })

    it("supports decoding", () => {
      const value = "ballast";
      expect(() => stringCodec.validateForDecoding(value)).to.not.throw();
      expect(() => stringCodec.validateForDecoding(1)).to.throw();
      const actual = stringCodec.decode(value);
      expect(actual).to.equal(value);
    });
  });

  describe("boolean codec", () => {
    it("supports encoding", () => {
      const value = false;
      expect(() => booleanCodec.validateForIdentifier(value)).to.not.throw();
      expect(() => booleanCodec.validateForIdentifier(1)).to.throw();
      const actual = booleanCodec.encode(value);
      expect(actual).to.equal(value);
    });

    it("supports decoding", () => {
      const value = true;
      expect(() => booleanCodec.validateForDecoding(value)).to.not.throw();
      expect(() => booleanCodec.validateForDecoding(1)).to.throw();
      const actual = booleanCodec.decode(value);
      expect(actual).to.equal(value);
    });
  });

  describe("float codec", () => {
    it("supports encoding", () => {
      const value = 22.5;
      expect(() => floatCodec.validateForIdentifier(value)).to.not.throw();
      expect(() => floatCodec.validateForIdentifier("200")).to.throw();
      const actual = floatCodec.encode(value);
      expect(actual).to.equal(value);
    });

    it("supports decoding", () => {
      const value = -3.114;
      expect(() => floatCodec.validateForDecoding(value)).to.not.throw();
      expect(() => floatCodec.validateForDecoding(false)).to.throw();
      const actual = floatCodec.decode(value);
      expect(actual).to.equal(value);
    });
  });


// todo add test for OOB numbers (single-precision int values)
  describe("integer codec", () => {
    it("supports encoding", () => {
      const value = -205;
      expect(() => integerCodec.validateForIdentifier(value)).to.not.throw();
      expect(() => integerCodec.validateForIdentifier(20.223)).to.throw();
      const actual = integerCodec.encode(value);
      expect(actual).to.equal(value);
    });

    it("supports decoding", () => {
      const value = 35957;
      expect(() => integerCodec.validateForDecoding(value)).to.not.throw();
      expect(() => integerCodec.validateForDecoding("happiness")).to.throw();
      const actual = integerCodec.decode(value);
      expect(actual).to.equal(value);
    });
  });

  describe("long codec", () => {
    it("supports encoding google longs", () => {
      const value = Long.fromNumber(4764576383);
      expect(() => longCodec.validateForIdentifier(value)).to.not.throw();
      const actual = longCodec.encode(value);
      expect(actual).to.contain.ordered.members([value.low, value.high]);
    });

    it("supports decoding array of 2 numbers into a google long", () => {
      const value = Long.fromNumber(4764576383);
      const longArray = [value.low, value.high];
      expect(() => longCodec.validateForDecoding(value)).to.throw();
      expect(() => longCodec.validateForDecoding(longArray)).to.not.throw();
      const actual = longCodec.decode(longArray);
      expect(actual).to.deep.equal(value);
    });
  });
});