import {expect} from "chai";
import * as Long from "long";

import {booleanCodec, floatCodec, integerCodec, longCodec, stringCodec} from "../../src/types/primitives";


describe("primitive codecs for identifier values", () => {

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
      const value = true;
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
    it("does not support decoding numbers", () => {
      const value = 996364853;
      expect(() => longCodec.validateForDecoding(value)).to.throw();
    });

    it("supports encoding google longs", () => {
      const value = Long.fromNumber(4764576383);
      expect(() => longCodec.validateForIdentifier(value)).to.not.throw();
      const actual = longCodec.encode(value);
      expect(actual).to.equal(value);
    });

    it("supports decoding google longs", () => {
      const value = Long.fromNumber(4764576383);
      expect(() => longCodec.validateForDecoding(value)).to.not.throw();
      expect(() => longCodec.validateForDecoding(-205)).to.throw();
      expect(() => longCodec.validateForDecoding(20.223)).to.throw();
      const actual = longCodec.decode(value);
      expect(actual).to.equal(value);
    });
  });
});