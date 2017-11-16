import {expect} from "chai";
import * as long from "long";

import {booleanCodec, floatCodec, integerCodec, longCodec, stringCodec} from "../../src/codecs/primitives";


describe("primitive codecs", () => {

  describe("string codec", () => {
    it("supports encoding", () => {
      const value = "ballast";
      expect(() => stringCodec.validateForEncoding(value)).to.not.throw();
      expect(() => stringCodec.validateForEncoding(1)).to.throw();
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
      expect(() => booleanCodec.validateForEncoding(value)).to.not.throw();
      expect(() => booleanCodec.validateForEncoding(1)).to.throw();
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
      expect(() => floatCodec.validateForEncoding(value)).to.not.throw();
      expect(() => floatCodec.validateForEncoding("200")).to.throw();
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
      expect(() => integerCodec.validateForEncoding(value)).to.not.throw();
      expect(() => integerCodec.validateForEncoding(20.223)).to.throw();
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
    it("supports encoding numbers", () => {
      const value = -205;
      expect(() => longCodec.validateForEncoding(value)).to.not.throw();
      expect(() => longCodec.validateForEncoding(20.223)).to.throw();
      let actual: long = longCodec.encode(value);
      expect(actual.toNumber()).to.equal(value);
    });

    it("supports encoding google longs", () => {
      const value = long.fromNumber(4764576383);
      expect(() => longCodec.validateForEncoding(value)).to.not.throw();
      const actual = longCodec.encode(value);
      expect(actual).to.equal(value);
    });

    it("supports decoding google longs", () => {
      const value = long.fromNumber(4764576383);
      expect(() => longCodec.validateForDecoding(value)).to.not.throw();
      expect(() => longCodec.validateForDecoding(-205)).to.throw();
      expect(() => longCodec.validateForDecoding(20.223)).to.throw();
      const actual = longCodec.decode(value);
      expect(actual).to.equal(value);
    });
  });
});