import {expect} from "chai";

import {Identifier} from "../../src/identifier";
import {codecSymbol} from "../../src/shared";
import {codecForTypeCode, findCodec} from "../../src/finder";
import {longCodec} from "../../src/types/long";
import {datetimeCodec} from "../../src/types/datetime";
import {anyCodec} from "../../src/types/any";
import {booleanCodec} from "../../src/types/boolean";
import {stringCodec} from "../../src/types/string";
import {integerCodec} from "../../src/types/integer";
import {floatCodec} from "../../src/types/float";
import {calculateSemanticTypeCode} from "../../src/semantic";


describe("codec finder", () => {

  describe("findCodec()", () => {
    it("throws an error with an identifier that is missing a codec", () => {
      const id: Identifier<string> = {
        type: "string",
        value: "boo"
      };
      expect(() => findCodec(id)).to.throw();
    });

    it("throws an error with an identifier that's codec isn't known by the finder", () => {
      const id: Identifier<string> = {
        type: "string",
        value: "boo",
        [codecSymbol]: {
          typeCode: -1
        }
      };
      expect(() => findCodec(id)).to.throw();
    });

    it("successfully finds a codec on an identifier", () => {
      const id: Identifier<string> = {
        type: "string",
        value: "boo",
        [codecSymbol]: anyCodec
      };
      expect(() => findCodec(id)).to.not.throw();
    });
  });

  describe("codecForTypeCode()", () => {
    it("throws error if it can't find a codec for a codeType", () => {
      expect(() => codecForTypeCode(-200)).to.throw();
    });

    it("finds the any codec", () => {
      const actual = codecForTypeCode(anyCodec.typeCode);
      expect(actual).to.equal(anyCodec);
    });

    it("finds string codec", () => {
      const actual = codecForTypeCode(stringCodec.typeCode);
      expect(actual).to.equal(stringCodec);
    });

    it("finds boolean codec", () => {
      const actual = codecForTypeCode(booleanCodec.typeCode);
      expect(actual).to.equal(booleanCodec);
    });

    it("finds float codec", () => {
      const actual = codecForTypeCode(floatCodec.typeCode);
      expect(actual).to.equal(floatCodec);
    });

    it("finds integer codec", () => {
      const actual = codecForTypeCode(integerCodec.typeCode);
      expect(actual).to.equal(integerCodec);
    });

    it("finds long codec", () => {
      const actual = codecForTypeCode(longCodec.typeCode);
      expect(actual).to.equal(longCodec);
    });

    it("finds datetime codec", () => {
      const actual = codecForTypeCode(datetimeCodec.typeCode);
      expect(actual).to.equal(datetimeCodec);
    });

    it("downgrades to a baser codec", () => {
      const actual = codecForTypeCode(calculateSemanticTypeCode(integerCodec.typeCode, 1000));
      expect(actual).to.equal(integerCodec);
    });
  });
});